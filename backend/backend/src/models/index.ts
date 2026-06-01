// src/models/index.ts
// This file registers all models with Sequelize
import User from './userModels';
import Station from './stationModels';
import Zone from './zoneModels';

export { User, Station, Zone };

// Ensure associations are set up
export default { User, Station, Zone };
