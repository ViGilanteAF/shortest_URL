import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { Consumer } from '../../common/util/consumer.util';
import { ShortestUrlRepository } from './shortest-url-query.repository';

@Processor('deadLetterQueue')
export class DeadLetterConsumer extends Consumer {
  constructor(
    protected readonly logger: Logger,
    @InjectQueue('deadLetterQueue') protected readonly deadLetterQueue: Queue,
    private readonly shortestUrlRepository: ShortestUrlRepository,
  ) {
    super(logger, deadLetterQueue);
  }

  @Process('increaseVisitCountByKey')
  async increaseVisitCountByKey(job: Job): Promise<void> {
    console.log('increaseVisitCountByKey', job);
    await this.shortestUrlRepository.increaseVisitCountByKey(job.data);
  }
}
