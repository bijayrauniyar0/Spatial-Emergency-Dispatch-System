import redisClient from '../config/redis';

export const publishCitizenIncidentUpdate = (citizenId: number, payload: object) => {
  redisClient.publish(`citizen:${citizenId}:incident`, JSON.stringify(payload));
};

export const publishStationIncidentUpdate = (stationId: number, payload: object) => {
  redisClient.publish(`station:${stationId}:incidents`, JSON.stringify(payload));
};
