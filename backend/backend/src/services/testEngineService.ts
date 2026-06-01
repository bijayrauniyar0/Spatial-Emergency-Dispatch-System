import sequelize from '../config/database';
import redisClient from '../config/redis';
import ExamSet from '../models/examSetModel';
import ExamSetQuestion from '../models/examSetQuestionModel';
import Question from '../models/questionModel';
import Attempt from '../models/attemptModel';
import AttemptAnswer from '../models/attemptAnswerModel';

const TIME_BUFFER_SECONDS = 60;
const REDIS_KEY_PREFIX = 'mocksewa:test:attempt';

/**
 * High-performance metadata fetch with Redis fallback.
 * Eliminates expensive JOINs on every sync/submit by caching attempt info.
 */
const getAttemptMetadata = async (attemptId: number) => {
  const redisKey = `${REDIS_KEY_PREFIX}:${attemptId}`;

  try {
    const cached = await redisClient.get(redisKey);
    if (cached) return JSON.parse(cached);
  } catch {
    // Fail silently, fallback to DB
  }

  // Fallback to DB: Fetch attempt and joined ExamSet time limit
  const attempt = await Attempt.findByPk(attemptId, {
    attributes: ['id', 'started_at', 'submitted_at', 'exam_set_id'],
    include: [{ model: ExamSet, as: 'examSet', attributes: ['time_limit'] }],
    raw: true,
    nest: true,
  });

  if (!attempt) return null;

  const metadata = {
    started_at: attempt.started_at,
    submitted_at: attempt.submitted_at,
    time_limit: (attempt as any).examSet.time_limit,
  };

  // Cache for the duration of the test + 10 mins buffer
  try {
    await redisClient.setEx(
      redisKey,
      metadata.time_limit + 600,
      JSON.stringify(metadata),
    );
  } catch {
    // Ignore cache failures
  }

  return metadata;
};

export const loadExamSetForTest = async (slug: string) => {
  const examSet = await ExamSet.findOne({
    where: { slug, is_published: true },
    attributes: [
      'id',
      'title',
      'slug',
      'type',
      'time_limit',
      'total_questions',
      'marks_per_question',
      'negative_marks_per_question',
    ],
    include: [
      {
        model: ExamSetQuestion,
        as: 'examSetQuestions',
        attributes: ['id', 'order_index', 'marks', 'negative_marks'],
        include: [
          {
            model: Question,
            as: 'question',
            attributes: ['id', 'question_text', 'type', 'image_url', 'options'],
          },
        ],
      },
    ],
    order: [
      [
        { model: ExamSetQuestion, as: 'examSetQuestions' },
        'order_index',
        'ASC',
      ],
    ],
  });

  if (!examSet) return null;

  const formattedQuestions = (examSet as any).examSetQuestions.map(
    (eq: any) => ({
      id: eq.id,
      question_id: eq.question?.id,
      order_index: eq.order_index,
      marks: eq.marks,
      negative_marks: eq.negative_marks,
      ...eq.question?.toJSON(),
    }),
  );

  return {
    examSet: {
      id: examSet.id,
      title: examSet.title,
      slug: examSet.slug,
      type: examSet.type,
      time_limit: examSet.time_limit,
      total_questions: examSet.total_questions,
      marks_per_question: examSet.marks_per_question,
      negative_marks_per_question: examSet.negative_marks_per_question,
    },
    questions: formattedQuestions,
  };
};

export const startNewAttempt = async (
  userId: number,
  examSetId: number,
  mode: 'PRACTICE' | 'RANKED',
) => {
  const attempt = await Attempt.create({
    user_id: userId,
    exam_set_id: examSetId,
    mode,
    started_at: new Date(),
  });

  // Hot-path: Pre-seed Redis cache so syncs can start immediately without a DB hit
  const examSet = await ExamSet.findByPk(examSetId, {
    attributes: ['time_limit'],
    raw: true,
  });
  if (examSet) {
    await redisClient.setEx(
      `${REDIS_KEY_PREFIX}:${attempt.id}`,
      examSet.time_limit + 600,
      JSON.stringify({
        started_at: attempt.started_at,
        submitted_at: null,
        time_limit: examSet.time_limit,
      }),
    );
  }

  return attempt;
};

export const saveAnswers = async (attemptId: number, answers: any[]) => {
  const metadata = await getAttemptMetadata(attemptId);
  if (!metadata || metadata.submitted_at)
    throw new Error('Attempt invalid or closed');

  const expiryTime = new Date(
    new Date(metadata.started_at).getTime() +
      (metadata.time_limit + TIME_BUFFER_SECONDS) * 1000,
  );
  if (new Date() > expiryTime) throw new Error('Attempt expired');

  // Atomic Bulk Upsert: 1 SQL Query vs N Queries
  const payload = answers.map(ans => ({
    attempt_id: attemptId,
    question_id: ans.question_id,
    selected_option: ans.selected_option,
    time_spent: ans.time_spent,
  }));

  await AttemptAnswer.bulkCreate(payload, {
    updateOnDuplicate: ['selected_option', 'time_spent'],
  });
};

export const finalizeAttempt = async (
  attemptId: number,
  timeTakenClient: number,
) => {
  const t = await sequelize.transaction();
  try {
    const attempt = await Attempt.findByPk(attemptId, {
      include: [{ model: ExamSet, as: 'examSet' }],
      transaction: t,
    });

    if (!attempt || attempt.submitted_at)
      throw new Error('Attempt already submitted or invalid');

    const examSet = (attempt as any).examSet;
    const serverElapsed = Math.floor(
      (Date.now() - attempt.started_at.getTime()) / 1000,
    );
    const effectiveTime = Math.min(serverElapsed, timeTakenClient);

    // Optimized Multi-Fetch: Get all grading data in two raw parallel queries
    const [userAnswers, setQuestions] = await Promise.all([
      AttemptAnswer.findAll({
        where: { attempt_id: attemptId },
        attributes: ['question_id', 'selected_option'],
        raw: true,
        transaction: t,
      }) as unknown as Promise<{ question_id: number; selected_option: string | null }[]>,
      ExamSetQuestion.findAll({
        where: { exam_set_id: attempt.exam_set_id },
        attributes: ['marks', 'negative_marks'],
        include: [
          { model: Question, as: 'question', attributes: ['id', 'answer'] },
        ],
        raw: true,
        nest: true,
        transaction: t,
      }) as unknown as Promise<{ marks: string|null; negative_marks: string|null; question: { id: number; answer: string } }[]>,
    ]);

    let score = 0,
      correct = 0,
      wrong = 0,
      unanswered = 0;
    const ansMap = new Map<number, string | null>(
      userAnswers.map(a => [a.question_id, a.selected_option]),
    );
    const scoredPayload: any[] = [];

    // Pure In-Memory Scoring Pass (O(N))
    for (const sq of setQuestions) {
      const q = sq.question;
      const userSelected = ansMap.get(q.id);
      const marks = Number(sq.marks || examSet.marks_per_question);
      const negMarks = Number(
        sq.negative_marks || examSet.negative_marks_per_question,
      );

      let isCorrect = false,
        awarded = 0;

      if (userSelected === undefined || userSelected === null) {
        unanswered++;
      } else if (userSelected === q.answer) {
        correct++;
        awarded = marks;
        isCorrect = true;
      } else {
        wrong++;
        awarded = -negMarks;
      }

      score += awarded;
      scoredPayload.push({
        attempt_id: attemptId,
        question_id: q.id,
        is_correct: isCorrect,
        marks_awarded: awarded,
      });
    }

    // Single Atomic Write: Marks all answer rows as graded
    await AttemptAnswer.bulkCreate(scoredPayload, {
      updateOnDuplicate: ['is_correct', 'marks_awarded'],
      transaction: t,
    });

    // Single Update: Updates parent effort summary
    const updatedAttempt = await attempt.update(
      {
        score,
        correct_count: correct,
        wrong_count: wrong,
        unanswered_count: unanswered,
        time_taken: effectiveTime,
        submitted_at: new Date(),
      },
      { transaction: t },
    );

    // Invalidate Redis cache
    await redisClient.del(`${REDIS_KEY_PREFIX}:${attemptId}`);

    await t.commit();
    return updatedAttempt;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
