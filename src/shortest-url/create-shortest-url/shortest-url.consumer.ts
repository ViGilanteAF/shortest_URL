import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../../kafka/consumer.service';
import { ShortestUrlRepository } from './shortest-url-query.adapter';

@Injectable()
export class ShortestUrlConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly shortestUrlRepository: ShortestUrlRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.consumerService.subscribe('increaseVisitCountByKey', {
      eachMessage: async ({ message }) => {
        await this.shortestUrlRepository.increaseVisitCountByKey(
          message.value?.toString(),
        );
      },
    });
  }
}
