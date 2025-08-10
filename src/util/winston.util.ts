import { utilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import { Environment } from '../config/env.validation';

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === Environment.Production ? 'http' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(process.env.NODE_ENV, {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ],
});
