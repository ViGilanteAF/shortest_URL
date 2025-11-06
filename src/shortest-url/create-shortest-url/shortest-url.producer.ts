import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UpdateShortestUrlPort } from '../port/out/update-shortest-url.port';

@Injectable()
export class ShortestUrlProducer implements UpdateShortestUrlPort {
  constructor(
    @InjectQueue('shortestUrlQueue')
    private readonly shortestUrlQueue: Queue,
  ) {}

  async increaseVisitCountByKey(shortestUrlKey: string): Promise<void> {
    await this.shortestUrlQueue.add('increaseVisitCountByKey', shortestUrlKey);
  }
}
