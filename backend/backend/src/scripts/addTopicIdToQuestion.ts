/* eslint-disable no-console */
/**
 * Migration: Add topic_id to questions table with foreign key to topics.
 *
 * Usage:  npx ts-node src/scripts/addTopicIdToQuestion.ts
 */
import sequelize from '../config/database';

async function migrate() {
  const t = await sequelize.transaction();
  try {
    await sequelize.authenticate();
    console.log('Connected.');

    // 1. Add column topic_id to questions table
    await sequelize.query(
      `ALTER TABLE questions ADD COLUMN IF NOT EXISTS topic_id INTEGER`,
      { transaction: t },
    );
    console.log('Column topic_id added to questions table.');

    // 2. Add foreign key constraint
    // Note: We use a separate ALTER TABLE to add the constraint to ensure it doesn't fail if column already exists
    try {
      await sequelize.query(
        `ALTER TABLE questions
         ADD CONSTRAINT fk_questions_topic
         FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL`,
        { transaction: t },
      );
      console.log('Foreign key constraint fk_questions_topic added.');
    } catch (fkError: any) {
      if (fkError.name === 'SequelizeDatabaseError' && fkError.message.includes('already exists')) {
        console.log('Foreign key constraint fk_questions_topic already exists.');
      } else {
        throw fkError;
      }
    }

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
