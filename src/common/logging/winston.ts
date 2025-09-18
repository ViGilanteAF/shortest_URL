import { utilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { Environment } from '../../config/env.validation';

const dailyOption = (level: string) => {
  return {
    level,
    datePattern: 'yyyy/MM/dd',
    dirname: `./logs/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    format: winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike(process.env.NODE_ENV, {
        colors: true,
        prettyPrint: true,
      }),
    ),
  };
};

const transports =
  process.env.NODE_ENV === Environment.Production
    ? [
        new winstonDaily(dailyOption('info')),
        new winstonDaily(dailyOption('warn')),
        new winstonDaily(dailyOption('error')),
      ]
    : [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(process.env.NODE_ENV, {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new winstonDaily(dailyOption('info')),
        new winstonDaily(dailyOption('warn')),
        new winstonDaily(dailyOption('error')),
      ];

export const winstonLogger = WinstonModule.createLogger({
  transports: transports,
});
