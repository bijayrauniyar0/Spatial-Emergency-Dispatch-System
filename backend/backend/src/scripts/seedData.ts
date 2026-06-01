/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import sequelize from '../config/database';
import Exam from '../models/examModel';
import Category from '../models/categoryModel';
import Subject from '../models/subjectModel';
import Topic from '../models/topicModel';
import Question from '../models/questionModel';
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

async function seed() {
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

    // 1. Bulk create Exams
    const examRecords = data.exams.map((e: any) => ({
      id: e.id,
      name: e.name,
      slug: slugify(e.name),
    }));
    await Exam.bulkCreate(examRecords, {
      updateOnDuplicate: ['name', 'slug'],
      transaction,
    });
    console.log('Exams seeded.');

    // 2. Bulk create Categories
    const categoryRecords = data.categories.map((c: any) => ({
      id: c.id,
      exam_id: c.exam_id,
      name: c.name,
      slug: slugify(c.name),
    }));
    await Category.bulkCreate(categoryRecords, {
      updateOnDuplicate: ['name', 'slug', 'exam_id'],
      transaction,
    });
    console.log('Categories seeded.');

    // 3. Bulk create Subjects
    // Infer category_id for each subject from the topics data
    const subjectToCategoryMap = new Map();
    data.topics.forEach((t: any) => {
      if (!subjectToCategoryMap.has(t.subject_id)) {
        subjectToCategoryMap.set(t.subject_id, t.category_id);
      }
    });

    const subjectRecords = data.subjects.map((s: any) => ({
      id: s.id,
      category_id: subjectToCategoryMap.get(s.id) || 1, // Default to 1 if no topic matches
      name: s.name,
      slug: slugify(s.name),
    }));
    await Subject.bulkCreate(subjectRecords, {
      updateOnDuplicate: ['name', 'slug', 'category_id'],
      transaction,
    });
    console.log('Subjects seeded.');

    // 4. Bulk create Topics
    const topicRecords = data.topics.map((t: any) => ({
      id: t.id,
      subject_id: t.subject_id,
      name: t.name,
      slug: slugify(t.name),
    }));
    await Topic.bulkCreate(topicRecords, {
      updateOnDuplicate: ['name', 'slug', 'subject_id'],
      transaction,
    });
    console.log('Topics seeded.');

    // 5. Bulk create Questions
    const questionRecords = data.questions.map((q: any) => ({
      id: q.id,
      question_text: q.question,
      options: q.options,
      answer: q.correct_answer,
      explanation: q.explanation,
      type: q.media_type || 'text',
    }));
    await Question.bulkCreate(questionRecords, {
      updateOnDuplicate: [
        'question_text',
        'options',
        'answer',
        'explanation',
        'type',
      ],
      transaction,
    });
    console.log('Questions seeded.');

    // 6. QuestionTags excluded as requested

    await transaction.commit();
    console.log('--- SEEDING COMPLETE ---');
    process.exit(0);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
