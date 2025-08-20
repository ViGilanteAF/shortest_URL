import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountService } from '../counter/count.service';
import { CounterModule } from '../counter/counter.module';
import { CreateShortestUrlService } from './create-shortest-url.service';
import { ShortestUrlCommandAdapter } from './create-shortest-url/shortest-url-command';
import {
  ShortestUrlEntity,
  ShortestUrlSchema,
} from './create-shortest-url/shortest-url.entity';
import { GetOriginalUrlService } from './get-original-url.service';
import { CreateShortestUrlUseCase } from './port/in/create-shortest-url.use-case';
import { GetOriginalUrlUseCase } from './port/in/get-original-url.use-case';
import { GetShortestUrlsUseCase } from './port/in/get-shortest-urls.use-case';
import { CountCommandPort } from './port/out/command-count.port';
import { GetCount } from './port/out/get-count';
import { ShortestUrlController } from './shortest-url.controller';

const ports = [
  { provide: GetCount, useClass: CountService },
  { provide: CountCommandPort, useClass: ShortestUrlCommandAdapter },
];

const useCase = [
  { provide: CreateShortestUrlUseCase, useClass: CreateShortestUrlService },
  { provide: GetOriginalUrlUseCase, useClass: GetOriginalUrlService },
  { provide: GetShortestUrlsUseCase, useValue: {} },
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortestUrlEntity.name, schema: ShortestUrlSchema },
    ]),
    CounterModule,
  ],
  controllers: [ShortestUrlController],
  providers: [...useCase, ...ports],
})
export class ShortestUrlModule {}
