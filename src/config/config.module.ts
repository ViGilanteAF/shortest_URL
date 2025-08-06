import { Module } from '@nestjs/common';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `${__dirname}/env/.env.${process.env.NODE_ENV}`,
      validate: validate,
      load: [serverConfig, databaseConfig],
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
