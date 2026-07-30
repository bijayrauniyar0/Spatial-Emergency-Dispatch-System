import sequelize from '../config/database';

async function migrateIncidentStatus() {
  try {
    console.log('Starting migration: Adding ARRIVED status to incidents...');

    // Add ARRIVED to the enum
    await sequelize.query(`
      ALTER TYPE enum_incidents_status ADD VALUE 'ARRIVED' BEFORE 'RESOLVED';
    `);

    console.log('✓ Successfully added ARRIVED to incident status enum');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('✓ ARRIVED status already exists in enum');
    } else {
      console.error('✗ Migration failed:', error.message);
      process.exit(1);
    }
  } finally {
    await sequelize.close();
  }
}

migrateIncidentStatus();
