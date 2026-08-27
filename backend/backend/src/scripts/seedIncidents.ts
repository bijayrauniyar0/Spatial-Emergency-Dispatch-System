import sequelize from '../config/database';
import User from '../models/userModels';
import Station from '../models/stationModels';
import Responder from '../models/responderModels';
import Incident from '../models/incidentModel';

interface SeededData {
  usersCreated: number;
  incidentsCreated: number;
  stationsUsed: number;
  respondersUsed: number;
}

const generateRandomCoordinates = (): [number, number] => {
  const latitude = 27.7172 + (Math.random() - 0.5) * 0.5;
  const longitude = 85.3240 + (Math.random() - 0.5) * 0.5;
  return [longitude, latitude];
};

const getRandomStatus = (): 'PENDING' | 'RESPONDING' | 'ARRIVED' | 'RESOLVED' => {
  const rand = Math.random();
  if (rand < 0.1) return 'PENDING';
  if (rand < 0.3) return 'RESPONDING';
  if (rand < 0.5) return 'ARRIVED';
  return 'RESOLVED';
};

const getRandomDate = (daysAgo: number = 90): Date => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  return pastDate;
};

const seedIncidents = async () => {
  try {
    console.log('🌱 Starting incident seeding...');

    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');

    const stats: SeededData = {
      usersCreated: 0,
      incidentsCreated: 0,
      stationsUsed: 0,
      respondersUsed: 0,
    };

    const transaction = await sequelize.transaction();

    try {
      // Fetch existing stations and responders
      const stations = await Station.findAll({ transaction });
      const responders = await Responder.findAll({ transaction });

      stats.stationsUsed = stations.length;
      stats.respondersUsed = responders.length;

      if (stations.length === 0) {
        throw new Error('No stations found in database. Please seed stations first.');
      }

      if (responders.length === 0) {
        throw new Error('No responders found in database. Please create responders first.');
      }

      // Create citizen users
      const citizenCount = 150;
      const citizenIds: number[] = [];

      console.log(`\n👥 Creating ${citizenCount} citizen users...`);
      for (let i = 0; i < citizenCount; i++) {
        const user = await User.create(
          {
            name: `Citizen ${i + 1}`,
            email: `citizen${i + 1}@example.com`,
            password: null,
            number: `98${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
            verified: false,
            oauth_provider: 'guest',
            role: 'citizen',
          },
          { transaction }
        );
        citizenIds.push(user.id);
        stats.usersCreated++;
      }
      console.log(`✅ Created ${citizenCount} citizen users`);

      // Create incidents
      const incidentCount = 500;
      console.log(`\n📋 Creating ${incidentCount} incidents...`);

      for (let i = 0; i < incidentCount; i++) {
        const station = stations[Math.floor(Math.random() * stations.length)];
        const citizen = citizenIds[Math.floor(Math.random() * citizenIds.length)];
        const category = station.category as 'POLICE' | 'FIRE' | 'MEDICAL';
        const status = getRandomStatus();
        const createdAt = getRandomDate(90);

        // Generate realistic times based on status
        let acceptedAt: Date | null = null;
        let updatedAt = createdAt;

        if (status !== 'PENDING') {
          acceptedAt = new Date(createdAt.getTime() + Math.random() * 5 * 60 * 1000); // 0-5 min after creation
          updatedAt = new Date(acceptedAt.getTime() + Math.random() * 30 * 60 * 1000); // 0-30 min after acceptance
        }

        const [longitude, latitude] = generateRandomCoordinates();

        const incident = await Incident.create(
          {
            citizen_id: citizen,
            station_id: station.id,
            responder_id: status === 'PENDING' ? null : responders[Math.floor(Math.random() * responders.length)].id,
            category,
            status,
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            accepted_at: acceptedAt,
          },
          { transaction }
        );

        // Update timestamps
        await sequelize.query(
          `UPDATE incidents SET created_at = :createdAt, updated_at = :updatedAt WHERE id = :id`,
          {
            replacements: {
              createdAt,
              updatedAt,
              id: incident.id,
            },
            transaction,
          }
        );

        stats.incidentsCreated++;

        if ((i + 1) % 100 === 0) {
          console.log(`  ✓ Created ${i + 1}/${incidentCount} incidents`);
        }
      }

      await transaction.commit();

      console.log('\n🎉 Incident seeding completed successfully!');
      console.log(`\n📊 Summary:`);
      console.log(`  - Citizens created: ${stats.usersCreated}`);
      console.log(`  - Incidents created: ${stats.incidentsCreated}`);
      console.log(`  - Stations used: ${stats.stationsUsed}`);
      console.log(`  - Responders used: ${stats.respondersUsed}`);
      console.log(`\n💡 Analytics dashboard should now show meaningful data!`);

      process.exit(0);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('❌ Error seeding incidents:', error);
    process.exit(1);
  }
};

seedIncidents();
