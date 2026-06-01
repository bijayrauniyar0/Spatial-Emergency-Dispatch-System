import { createClient } from 'redis';
import { REDIS_URL } from '../constants';

const redisClient = createClient({
  url: REDIS_URL || 'redis://redis:6379',
});

export async function connectRedis() {
  try {
    await redisClient.connect();
  } catch {
    // console.error('Redis connection error:', error);
  }
}

export default redisClient;
