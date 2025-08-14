import { registerAs } from '@nestjs/config';

export const configServer = registerAs('server', () => ({
  port: parseInt(process.env.PORT!),
}));
