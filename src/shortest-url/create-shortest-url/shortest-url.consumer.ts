import { Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('shortestUrlQueue')
export class ShortestUrlConsumer {
  constructor(private readonly shortestUrlRepository: ShortestUrlRepository) {}

  @Porcess('increaseVisitCountByKey')
  async increaseVisitCountByKey(job: Job): Promise<void> {
    await this.shortestUrlRepository.increaseVisitCountByKey(job.data);
  }
}
