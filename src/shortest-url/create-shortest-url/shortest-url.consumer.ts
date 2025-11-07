import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ShortestUrlRepository } from './shortest-url-query.adapter';

@Processor('shortestUrlQueue')
export class ShortestUrlConsumer {
  constructor(private readonly shortestUrlRepository: ShortestUrlRepository) {}

  @Process('increaseVisitCountByKey')
  async increaseVisitCountByKey(job: Job): Promise<void> {
    await this.shortestUrlRepository.increaseVisitCountByKey(job.data);
  }
}
