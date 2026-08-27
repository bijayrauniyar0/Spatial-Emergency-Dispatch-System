import sequelize from '../config/database';

async function migrateResponderLocation() {
  try {
    console.log('Starting migration: Adding location fields to responders...');

    // Add location column
    await sequelize.query(`
      ALTER TABLE responders ADD COLUMN IF NOT EXISTS location GEOMETRY(Point, 4326);
    `);

    // Add location_updated_at column
    await sequelize.query(`
      ALTER TABLE responders ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP;
    `);

    console.log('✓ Successfully added location fields to responders table');
  } catch (error: any) {
    if (error.message.includes('already exists') || error.message.includes('does not exist')) {
      console.log('✓ Location fields already exist in responders table');
    } else {
      console.error('✗ Migration failed:', error.message);
      process.exit(1);
    }
  } finally {
    await sequelize.close();
  }
}

migrateResponderLocation();
