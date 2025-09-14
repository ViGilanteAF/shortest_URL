import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountService } from '../counter/count.service';
import { CountEntity, CountSchema } from '../counter/entity/count.entity';
import { CreateShortestUrlService } from './create-shortest-url.service';
import { ShortestUrlAdapter } from './create-shortest-url/shortest-url-query.adapter';
import { CountAdapter } from './create-shortest-url/shortest-url.count.adapter';
import { ShortestUrlEntity, ShortestUrlSchema, } from './create-shortest-url/shortest-url.entity';
import { GetShortestUrlsService } from './create-shortest-urls.service';
import { GetOriginalUrlService } from './get-original-url.service';
import { CreateShortestUrlUseCase } from './port/in/create-shortest-url.use-case';
import { GetOriginalUrlUseCase } from './port/in/get-original-url.use-case';
import { GetShortestUrlsUseCase } from './port/in/get-shortest-urls.use-case';
import { CountCommandPort } from './port/out/command-count.port';
import { GetCount } from './port/out/get-count';
import { ShortestUrlCommandPort } from './port/out/shortest-url-command.port';
import { QueryShortestUrlPort } from './port/out/shortest-url-query.port';
import { ShortestUrlController } from './shortest-url.controller';

const ports: Provider[] = [
  { provide: GetCount, useClass: CountService },
  { provide: CountCommandPort, useClass: CountAdapter },
  { provide: ShortestUrlCommandPort, useClass: ShortestUrlAdapter },
  { provide: QueryShortestUrlPort, useClass: ShortestUrlAdapter },
];

const useCase: Provider[] = [
  { provide: CreateShortestUrlUseCase, useClass: CreateShortestUrlService },
  { provide: GetOriginalUrlUseCase, useClass: GetOriginalUrlService },
  { provide: GetShortestUrlsUseCase, useClass: GetShortestUrlsService },
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortestUrlEntity.name, schema: ShortestUrlSchema },
      { name: CountEntity.name, schema: CountSchema },
    ]),
  ],
  controllers: [ShortestUrlController],
  providers: [...useCase, ...ports],
})
export class ShortestUrlModule {}
