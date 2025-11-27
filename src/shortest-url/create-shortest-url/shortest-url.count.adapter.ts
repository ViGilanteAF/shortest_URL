import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mutex } from 'async-mutex';
import { Model } from 'mongoose';

import { CountEntity } from '../../counter/entity/count.entity';
import { LoadUpdateCountPort } from '../port/out/load-update-count.port';

@Injectable()
export class CountAdapter implements LoadUpdateCountPort {
  static COUNT_RANGE: 10000;

  private mutex = new Mutex();
  private count = {
    first: 0,
    current: 0,
    end: 0,
  };

  constructor(
    @InjectModel(CountEntity.name)
    private readonly countModel: Model<CountEntity>,
  ) {}

  async findCountIncrease(): Promise<number> {
    await this.mutex.acquire();
    try {
      if (this.count.current === this.count.end) {
        await this.setCount();
      } else {
        this.count.current++;
      }
    } finally {
      this.mutex.release();
    }

    return this.count.current;
  }

  private async setCount() {
    const count = await this.countModel.findOneAndUpdate(
      {},
      { $inc: { current: CountAdapter.COUNT_RANGE } },
    );
    this.count.first = count!.current;
    this.count.current = this.count.first;
    this.count.end = this.count.first + CountAdapter.COUNT_RANGE;
  }
}
