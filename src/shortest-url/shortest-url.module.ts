import { Module } from '@nestjs/common';
import { ShortestUrlController } from './create-shotest-url/shortest-url.controller';
import { CreateShortestUrlUseCase } from './port/in/create-shortest-url.use-case';

const useCase = [{ provide: CreateShortestUrlUseCase, useValue: {} }];

@Module({
  controllers: [ShortestUrlController],
  providers: [...useCase],
})
export class ShortestUrlModule {}
