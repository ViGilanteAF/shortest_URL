import { BullModule } from '@nestjs/bull';
import { Logger, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountService } from '../counter/count.service';
import { CountEntity, CountSchema } from '../counter/entity/count.entity';
import { CountServiceImpl } from './count.service';
import { CreateShortestUrlServiceImpl } from './create-shortest-url.service';
import {
  MessageEntity,
  MessageSchema,
} from './create-shortest-url/entity/message.entity';
import { ShortestUrlCacheRepositoryImpl } from './create-shortest-url/shortest-url-cache.adapter';

import {
  ShortestUrlRepository,
  ShortestUrlRepositoryImpl,
} from './create-shortest-url/shortest-url-query.adapter';
import { ShortestUrlConsumer } from './create-shortest-url/shortest-url.consumer';
import { CountRepositoryImpl } from './create-shortest-url/shortest-url.count.repository';

import {
  ShortestUrlEntity,
  ShortestUrlSchema,
} from './create-shortest-url/shortest-url.entity';
import { ShortestUrlProducer } from './create-shortest-url/shortest-url.producer';
import { GetShortestUrlsServiceImpl } from './create-shortest-urls.service';
import { GetOriginalUrlServiceImpl } from './get-original-url.service';
import { CreateShortestUrlUseCase } from './port/in/create-shortest-url.use-case';
import { GetOriginalUrlUseCase } from './port/in/get-original-url.use-case';
import { GetShortestUrlsUseCase } from './port/in/get-shortest-urls.use-case';
import { CreateShortestUrlCachePort } from './port/out/create-shortest-url-cache.port';
import { CreateShortestUrlPort } from './port/out/create-shortest-url.port';
import { LoadShortestUrlCachePort } from './port/out/load-shortest-url-cache.port';
import { LoadShortestUrlPort } from './port/out/load-shortest-url.port';
import { LoadUpdateCountPort } from './port/out/load-update-count.port';
import { UpdateShortestUrlPort } from './port/out/update-shortest-url.port';
import { ShortestUrlController } from './shortest-url.controller';

const repositories: Provider[] = [
  { provide: ShortestUrlRepository, useClass: ShortestUrlRepositoryImpl },
];

const services: Provider[] = [
  { provide: CountService, useClass: CountServiceImpl },
];

const ports: Provider[] = [
  { provide: LoadUpdateCountPort, useClass: CountRepositoryImpl },
  { provide: CreateShortestUrlPort, useClass: ShortestUrlRepositoryImpl },
  {
    provide: LoadShortestUrlCachePort,
    useClass: ShortestUrlCacheRepositoryImpl,
  },
  { provide: UpdateShortestUrlPort, useClass: ShortestUrlProducer },
  { provide: LoadShortestUrlPort, useClass: ShortestUrlRepositoryImpl },
  {
    provide: CreateShortestUrlCachePort,
    useClass: ShortestUrlCacheRepositoryImpl,
  },
];

const useCase: Provider[] = [
  { provide: CreateShortestUrlUseCase, useClass: CreateShortestUrlServiceImpl },
  { provide: GetOriginalUrlUseCase, useClass: GetOriginalUrlServiceImpl },
  { provide: GetShortestUrlsUseCase, useClass: GetShortestUrlsServiceImpl },
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortestUrlEntity.name, schema: ShortestUrlSchema },
      { name: CountEntity.name, schema: CountSchema },
      { name: MessageEntity.name, schema: MessageSchema },
    ]),
    BullModule.registerQueue({ name: 'shortestUrlQueue' }),
    BullModule.registerQueue({ name: 'deadLetterQueue' }),
  ],
  controllers: [ShortestUrlController],
  providers: [
    ...repositories,
    ...services,
    ...useCase,
    ...ports,
    Logger,
    ShortestUrlConsumer,
  ],
})
export class ShortestUrlModule {}
