import { registerAs } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const cacheConfig = registerAs(
  'cache',
  () =>
    <RedisClientOptions>{
      store: redisStore,
      url: process.env.REDIS_CACHE_URL,
      ttl: parseInt(process.env.CACHE_TTL!),
    },
);
