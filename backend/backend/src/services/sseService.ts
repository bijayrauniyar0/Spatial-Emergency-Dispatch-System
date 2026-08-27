import redisClient from '../config/redis';

export const publishCitizenIncidentUpdate = (citizenId: number, payload: object) => {
  try {
    if (!redisClient.isOpen) {
      console.warn(`Redis not connected. Cannot publish citizen update for citizen ${citizenId}`);
      return;
    }
    redisClient.publish(`citizen:${citizenId}:incident`, JSON.stringify(payload));
  } catch (error) {
    console.error(`Failed to publish citizen update for citizen ${citizenId}:`, error);
  }
};

export const publishStationIncidentUpdate = (stationId: number, payload: object) => {
  try {
    if (!redisClient.isOpen) {
      console.warn(`Redis not connected. Cannot publish station update for station ${stationId}`);
      return;
    }
    redisClient.publish(`station:${stationId}:incidents`, JSON.stringify(payload));
  } catch (error) {
    console.error(`Failed to publish station update for station ${stationId}:`, error);
  }
};
