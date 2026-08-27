import sequelize from '../config/database';
import User from '../models/userModels';
import Station from '../models/stationModels';
import Responder from '../models/responderModels';
import bcrypt from 'bcryptjs';

// Configuration - change password here
const RESPONDER_PASSWORD = 'Responder@123';
const RESPONDERS_PER_STATION = 3;

const seedResponders = async () => {
  try {
    console.log('🌱 Starting responder seeding...');

    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');

    const transaction = await sequelize.transaction();

    try {
      // Fetch all stations
      const stations = await Station.findAll({ transaction });

      if (stations.length === 0) {
        throw new Error('No stations found in database. Please seed stations first with: npm run seed');
      }

      console.log(`\n📍 Found ${stations.length} stations`);

      // Hash password once
      const hashedPassword = await bcrypt.hash(RESPONDER_PASSWORD, 10);

      let usersCreated = 0;
      let respondersCreated = 0;

      // Create responders for each station
      for (const station of stations) {
        console.log(`\n🏢 Creating ${RESPONDERS_PER_STATION} responders for ${station.name} (${station.category})...`);

        for (let i = 1; i <= RESPONDERS_PER_STATION; i++) {
          const email = `${station.category.toLowerCase()}-responder-${station.id}-${i}@seds.com`;
          const name = `${station.category} Responder ${i} - ${station.name}`;

          // Create user
          const user = await User.create(
            {
              name,
              email,
              password: hashedPassword,
              number: `98${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
              verified: true,
              oauth_provider: 'local',
              role: 'responder',
            },
            { transaction }
          );
          usersCreated++;

          // Create responder record
          await Responder.create(
            {
              station_id: station.id,
              user_id: user.id,
              status: 'AVAILABLE',
              has_active_task: false,
            },
            { transaction }
          );
          respondersCreated++;

          console.log(`  ✓ Created responder: ${email}`);
        }
      }

      await transaction.commit();

      console.log('\n🎉 Responder seeding completed successfully!');
      console.log(`\n📊 Summary:`);
      console.log(`  - Responder users created: ${usersCreated}`);
      console.log(`  - Responder records created: ${respondersCreated}`);
      console.log(`  - Password: ${RESPONDER_PASSWORD}`);
      console.log(`\n💡 Ready to seed incidents with: npm run seed:incidents`);

      process.exit(0);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('❌ Error seeding responders:', error);
    process.exit(1);
  }
};

seedResponders();
