import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mutex } from '../../common/util/mutex.util';

import { CountEntity } from '../../counter/entity/count.entity';
import { LoadUpdateCountPort } from '../port/out/load-update-count.port';

@Injectable()
export class CountAdapter implements LoadUpdateCountPort {
  static COUNT_RANGE = 10000;
  private readonly mutex = new Mutex();
  private readonly count = {
    first: 0,
    current: 0,
    end: 0,
  };
  constructor(
    @InjectModel(CountEntity.name)
    private readonly countModel: Model<CountEntity>,
  ) {}

  async findCountIncrease(): Promise<number> {
    await this.mutex.lock();

    if (this.count.current === this.count.end) {
      const currentCount = await this.countModel.findOneAndUpdate(
        {},
        { $inc: { current: CountAdapter.COUNT_RANGE } },
      );
      this.count.first = currentCount!.current;
      this.count.current = this.count.first;
      this.count.end = this.count.first + CountAdapter.COUNT_RANGE;
    } else {
      this.count.current++;
    }

    this.mutex.unlock();

    return this.count.current;
  }
}
