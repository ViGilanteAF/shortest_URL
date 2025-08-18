import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountService } from '../counter/count.service';
import { CounterModule } from '../counter/counter.module';
import { CreateShortestUrlService } from './create-shortest-url.service';
import { ShortestUrlCommandAdapter } from './create-shortest-url/shortest-url-command';
import { ShortestUrlController } from './create-shortest-url/shortest-url.controller';
import {
  ShortestUrlEntity,
  ShortestUrlSchema,
} from './create-shortest-url/shortest-url.entity';
import { CreateShortestUrlUseCase } from './port/in/create-shortest-url.use-case';
import { GetOriginalUrlUseCase } from './port/in/get-original-url.use-case';
import { CountCommandPort } from './port/out/command-count.port';
import { GetCount } from './port/out/get-count';

const ports = [
  { provide: GetCount, useClass: CountService },
  { provide: CountCommandPort, useClass: ShortestUrlCommandAdapter },
];

const useCase = [
  { provide: CreateShortestUrlUseCase, useClass: CreateShortestUrlService },
  { provide: GetOriginalUrlUseCase, useValue: {} },
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
