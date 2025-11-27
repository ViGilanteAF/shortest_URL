import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { Consumer } from '../../common/util/consumer.util';
import { MessageRepository } from './message.adapter';
import { ShortestUrlRepository } from './shortest-url-query.adapter';

@Processor('shortestUrlQueue')
export class ShortestUrlConsumer extends Consumer {
  constructor(
    protected readonly logger: Logger,
    @InjectQueue('deadLetterQueue') protected readonly deadLetterQueue: Queue,
    private readonly shortestUrlRepository: ShortestUrlRepository,
    private readonly messageRepository: MessageRepository,
  ) {
    super(logger, deadLetterQueue);
  }

  @Process('increaseVisitCountByKey')
  async increaseVisitCountByKey(job: Job): Promise<void> {
    try {
      await this.messageRepository.createMessage(<string>job.id);

      await this.shortestUrlRepository.increaseVisitCountByKey(job.data);
    } catch (err) {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return;
      }
      throw err;
    }
  }
}
