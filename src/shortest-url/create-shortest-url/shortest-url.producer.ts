import { Injectable } from '@nestjs/common';
import { ProducerService } from '../../kafka/producer.service';
import { UpdateShortestUrlPort } from '../port/out/update-shortest-url.port';

@Injectable()
export class ShortestUrlProducer implements UpdateShortestUrlPort {
  constructor(private readonly producerService: ProducerService) {}

  async increaseVisitCountByKey(shortestUrlKey: string): Promise<void> {
    await this.producerService.send({
      topic: 'increaseVisitCountByKey',
      messages: [{ value: shortestUrlKey }],
    });
  }
}
