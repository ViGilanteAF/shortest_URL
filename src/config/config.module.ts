import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/common/cache';
import { ConfigModule as NestConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validate } from 'class-validator';
import { configServer } from './config';
import { configDatabase } from './configDatabase';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `${__dirname}/env/.env.${process.env.NODE_ENV}`,
      validate: validate,
      load: [configServer, configDatabase],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [configDatabase.KEY],
      useFactory: (config: ConfigType<typeof configDatabase>) => config,
    }),
    CacheModule.registerAsync({
      inject: [cacheConfig.KEY],
      useFactory: (config: ConfigType<typeof cacheConfig>) => config,
    }),
  ],
})
export class ConfigModule {}
