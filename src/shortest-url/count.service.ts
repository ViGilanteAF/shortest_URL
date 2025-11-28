import { Injectable } from '@nestjs/common';
import { Mutex } from '../common/util/mutex.util';
import { Count } from './domain/count';
import { LoadUpdateCountPort } from './port/out/load-update-count.port';

export abstract class CountService {
  static COUNT_RANGE = 10000;

  abstract getCurrentCount(): Promise<number>;
}

@Injectable()
export class CountServiceImpl implements CountService {
  private mutex = new Mutex();
  private readonly count = new Count();

  constructor(private readonly loadUpdateCountPort: LoadUpdateCountPort) {}

  async getCurrentCount(): Promise<number> {
    await this.mutex.acquire();
    try {
      if (this.count.isFinished()) {
        const start = await this.loadUpdateCountPort.findCountIncrease(
          CountService.COUNT_RANGE,
        );
        this.count.setCount(start);
      } else {
        this.count.increaseCurrentCount();
      }
    } finally {
      this.mutex.release();
    }

    return this.count.current;
  }
}
