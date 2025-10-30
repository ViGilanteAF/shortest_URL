import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountService } from '../counter/count.service';
import { CountEntity, CountSchema } from '../counter/entity/count.entity';
import { CreateShortestUrlService } from './create-shortest-url.service';
import { ShortestUrlAdapter } from './create-shortest-url/shortest-url-query.adapter';
import { CountAdapter } from './create-shortest-url/shortest-url.count.adapter';
import {
  ShortestUrlEntity,
  ShortestUrlSchema,
} from './create-shortest-url/shortest-url.entity';
import { GetShortestUrlsService } from './create-shortest-urls.service';
import { GetOriginalUrlService } from './get-original-url.service';
import { CreateShortestUrlUseCase } from './port/in/create-shortest-url.use-case';
import { GetOriginalUrlUseCase } from './port/in/get-original-url.use-case';
import { GetShortestUrlsUseCase } from './port/in/get-shortest-urls.use-case';
import { CreateShortestUrlPort } from './port/out/create-shortest-url.port';
import { GetCount } from './port/out/get-count';
import { LoadShortestUrlPort } from './port/out/load-shortest-url.port';
import { LoadUpdateCountPort } from './port/out/load-update-count.port';
import { UpdateShortestUrlPort } from './port/out/update-shortest-url.port';
import { ShortestUrlController } from './shortest-url.controller';

const ports: Provider[] = [
  { provide: GetCount, useClass: CountService },
  { provide: LoadUpdateCountPort, useClass: CountAdapter },
  { provide: CreateShortestUrlPort, useClass: ShortestUrlAdapter },
  { provide: LoadShortestUrlPort, useClass: ShortestUrlAdapter },
  { provide: UpdateShortestUrlPort, useClass: ShortestUrlAdapter },
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
