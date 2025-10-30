import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateShortestUrlUseCase } from '../shortest-url/port/in/create-shortest-url.use-case';
import { LoadUpdateCountPort } from '../shortest-url/port/out/load-update-count.port';
import { CountCommand } from './count-command';
import { CountService } from './count.service';
import { CountEntity, CountSchema } from './entity/count.entity';

const ports = [{ provide: LoadUpdateCountPort, useClass: CountCommand }];
const useCases = [
  { provide: CreateShortestUrlUseCase, useClass: CountService },
];
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CountEntity.name, schema: CountSchema },
    ]),
  ],
  providers: [...useCases, ...ports],
  exports: [LoadUpdateCountPort],
})
export class CounterModule {}
