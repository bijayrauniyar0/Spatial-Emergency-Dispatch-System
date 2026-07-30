import redisClient from '../config/redis';

export const publishCitizenIncidentUpdate = (citizenId: number, payload: object) => {
  redisClient.publish(`citizen:${citizenId}:incident`, JSON.stringify(payload));
};
