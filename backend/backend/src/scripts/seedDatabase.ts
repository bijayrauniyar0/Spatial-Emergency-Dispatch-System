import sequelize from '../config/database';
import Station from '../models/stationModels';
import Zone from '../models/zoneModels';
import sampleData from '../constants/sample-data.json';

interface SampleStation {
  name: string;
  category: 'POLICE' | 'FIRE' | 'MEDICAL';
  latitude: number;
  longitude: number;
  zoneGeoJson: Record<string, any>;
}

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');

    // Clear existing stations and zones
    const deleteZones = await Zone.destroy({ where: {} });
    const deleteStations = await Station.destroy({ where: {} });
    console.log(`🗑️  Cleared ${deleteStations} stations and ${deleteZones} zones`);

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      let stationCount = 0;
      let zoneCount = 0;

      for (const stationData of sampleData as SampleStation[]) {
        // Create station
        const station = await Station.create(
          {
            name: stationData.name,
            category: stationData.category,
            location: {
              type: 'Point',
              coordinates: [stationData.longitude, stationData.latitude],
            },
          },
          { transaction }
        );

        stationCount++;

        // Create zone
        const zone = await Zone.create(
          {
            station_id: station.id,
            boundary: sequelize.fn(
              'ST_GeomFromGeoJSON',
              JSON.stringify(stationData.zoneGeoJson)
            ) as any,
          },
          { transaction, raw: true }
        );

        // Set SRID
        await sequelize.query(
          `UPDATE zones SET boundary = ST_SetSRID(boundary, 4326) WHERE id = ?`,
          {
            replacements: [zone.id],
            transaction,
          }
        );

        zoneCount++;
        console.log(`✅ Created station: ${station.name} (${station.category})`);
      }

      await transaction.commit();

      console.log('\n🎉 Database seeding completed successfully!');
      console.log(`📊 Summary: ${stationCount} stations and ${zoneCount} zones created`);
      process.exit(0);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
