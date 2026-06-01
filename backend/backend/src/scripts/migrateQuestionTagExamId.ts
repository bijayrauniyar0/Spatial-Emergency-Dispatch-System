/* eslint-disable no-console */
/**
 * One-time migration: Add exam_id to question_tags and backfill from categories.
 *
 * Usage:  npx ts-node src/scripts/migrateQuestionTagExamId.ts
 */
import sequelize from '../config/database';

async function migrate() {
  const t = await sequelize.transaction();
  try {
    await sequelize.authenticate();
    console.log('Connected.');

    // 1. Add column as NULLABLE (so existing rows don't break)
    await sequelize.query(
      `ALTER TABLE question_tags ADD COLUMN IF NOT EXISTS exam_id INTEGER`,
      { transaction: t },
    );
    console.log('Column added (nullable).');

    // 2. Backfill: derive exam_id from the category's exam_id
    const [, meta] = await sequelize.query(
      `UPDATE question_tags
          SET exam_id = c.exam_id
         FROM categories c
        WHERE question_tags.category_id = c.id
          AND question_tags.exam_id IS NULL`,
      { transaction: t },
    );
    console.log(`Backfilled ${(meta as any)?.rowCount ?? '?'} rows.`);

    // 3. Set NOT NULL + foreign key
    await sequelize.query(
      `ALTER TABLE question_tags ALTER COLUMN exam_id SET NOT NULL`,
      { transaction: t },
    );
    await sequelize.query(
      `ALTER TABLE question_tags
         ADD CONSTRAINT fk_question_tags_exam
         FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE`,
      { transaction: t },
    );
    console.log('Column set to NOT NULL with FK constraint.');

    // 4. Drop old unique index and recreate with exam_id
    await sequelize.query(
      `DROP INDEX IF EXISTS question_tags_question_id_category_id_subject_id_topic_id`,
      { transaction: t },
    );
    await sequelize.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS question_tags_question_id_exam_id_category_id_subject_id_topic_id
       ON question_tags (question_id, exam_id, category_id, subject_id, topic_id)`,
      { transaction: t },
    );
    console.log('Unique index updated.');

    await t.commit();
    console.log('--- MIGRATION COMPLETE ---');
    process.exit(0);
  } catch (err) {
    await t.rollback();
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
