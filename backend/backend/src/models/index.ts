// src/models/index.ts
// This file registers all models with Sequelize
import User from './userModels';
import Station from './stationModels';
import Zone from './zoneModels';
import Responder from './responderModels';
import Incident from './incidentModel';

export { User, Station, Zone, Responder, Incident };

// Ensure associations are set up
export default { User, Station, Zone, Responder, Incident };
