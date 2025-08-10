import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/core';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `${__dirname}/env/.env.${process.env.NODE_ENV}`,
      validate: validate,
      load: [serverConfig, databaseConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigModule.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) => config,
    }),
    CacheModule.registerAsync({
      inject: [cacheConfig.KEY],
      useFactory: (config: ConfigType<typeof cacheConfig>) => config,
    }),
  ],
})
export class ConfigModule {}
