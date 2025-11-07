import { registerAs } from '@nestjs/config';

export const azConfig = registerAs('az', () => ({
  redis: {
    host: process.env.REDIS_AZ_HOST,
    port: parseInt(process.env.REDIS_AZ_PORT!),
    password: process.env.REDIS_AZ_PASSWORD,
  },
}));
