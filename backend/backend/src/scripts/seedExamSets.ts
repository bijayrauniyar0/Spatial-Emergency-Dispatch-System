/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import sequelize from '../config/database';
import ExamSet from '../models/examSetModel';
import ExamSetQuestion from '../models/examSetQuestionModel';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

async function seedExamSets() {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Ensure schema is up to date
    await sequelize.sync({ alter: true });
    console.log('Database synced.');

    // Read the unified JSON file
    const jsonPath = path.join(__dirname, 'seed_data.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    const questionTags = data.question_tags;
    const categories = data.categories;
    const subjects = data.subjects;
    const topics = data.topics;

    console.log('Clearing old exam sets if exist...');
    await ExamSetQuestion.destroy({ where: {}, transaction });
    await ExamSet.destroy({ where: {}, transaction });

    console.log('Creating Exam Sets...');

    for (const category of categories) {
      const categoryTags = questionTags.filter((qt: any) => qt.category_id === category.id);
      if (categoryTags.length === 0) continue;

      // Prevent duplicate questions in a set
      const getUniqueQuestions = (tags: any[]) => Array.from(new Set(tags.map(t => t.question_id)));

      // --- 1. FULL MOCK ---
      const fullMockQuestions = getUniqueQuestions(categoryTags);
      const fullMockTitle = `${category.name} - Full Mock 1`;
      const fullMockSlug = slugify(fullMockTitle + `-${category.id}-mock`);
      
      const fullMock = await ExamSet.create({
        category_id: category.id,
        title: fullMockTitle,
        slug: fullMockSlug,
        type: 'FULL_MOCK',
        time_limit: fullMockQuestions.length * 60, // 1 min per q
        total_questions: fullMockQuestions.length,
        marks_per_question: 1,
        negative_marks_per_question: 0.2,
        access_level: 'FREE',
        is_published: true,
      }, { transaction });

      const fullMockEqs = fullMockQuestions.map((qId: number, index: number) => ({
        exam_set_id: fullMock.id,
        question_id: qId,
        order_index: index,
        marks: null,
        negative_marks: null,
      }));
      await ExamSetQuestion.bulkCreate(fullMockEqs, { transaction });

      // --- 2. SECTIONAL SETS ---
      const subjectIds = Array.from(new Set(categoryTags.map((qt: any) => qt.subject_id)));
      for (const subId of subjectIds) {
        const subject = subjects.find((s: any) => s.id === subId);
        if (!subject) continue;
        
        const sectionalTags = categoryTags.filter((qt: any) => qt.subject_id === subId);
        const sectionalQuestions = getUniqueQuestions(sectionalTags);
        
        const secTitle = `${category.name} - ${subject.name} Sectional`;
        const secSlug = slugify(secTitle + `-${category.id}-${subId}-sec`);
        
        const sectional = await ExamSet.create({
          category_id: category.id,
          title: secTitle,
          slug: secSlug,
          type: 'SECTIONAL',
          time_limit: sectionalQuestions.length * 60,
          total_questions: sectionalQuestions.length,
          marks_per_question: 1,
          negative_marks_per_question: 0.2,
          access_level: 'FREE',
          is_published: true,
        }, { transaction });

        const secEqs = sectionalQuestions.map((qId: number, index: number) => ({
          exam_set_id: sectional.id,
          question_id: qId,
          order_index: index,
          marks: null,
          negative_marks: null,
        }));
        await ExamSetQuestion.bulkCreate(secEqs, { transaction });
      }

      // --- 3. TOPIC SETS ---
      const topicIds = Array.from(new Set(categoryTags.map((qt: any) => qt.topic_id)));
      for (const tId of topicIds) {
        const topic = topics.find((t: any) => t.id === tId);
        if (!topic) continue;
        
        const topicTags = categoryTags.filter((qt: any) => qt.topic_id === tId);
        const topicQuestions = getUniqueQuestions(topicTags);
        
        const topTitle = `${category.name} - ${topic.name} Topic Quiz`;
        const topSlug = slugify(topTitle + `-${category.id}-${tId}-top`);
        
        const topicSet = await ExamSet.create({
          category_id: category.id,
          title: topTitle,
          slug: topSlug,
          type: 'TOPIC',
          time_limit: topicQuestions.length * 60,
          total_questions: topicQuestions.length,
          marks_per_question: 1,
          negative_marks_per_question: 0.2,
          access_level: 'FREE',
          is_published: true,
        }, { transaction });

        const topEqs = topicQuestions.map((qId: number, index: number) => ({
          exam_set_id: topicSet.id,
          question_id: qId,
          order_index: index,
          marks: null,
          negative_marks: null,
        }));
        await ExamSetQuestion.bulkCreate(topEqs, { transaction });
      }
    }

    await transaction.commit();
    console.log('--- EXAM SET SEEDING COMPLETE ---');
    process.exit(0);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedExamSets();
