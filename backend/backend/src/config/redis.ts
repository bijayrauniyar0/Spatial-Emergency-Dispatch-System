import { createClient } from 'redis';
import { REDIS_URL } from '../constants';

const redisClient = createClient({
  url: REDIS_URL || 'redis://redis:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

export async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('✓ Redis connection established');
    return true;
  } catch (error) {
    console.error('✗ Redis connection failed:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export default redisClient;
