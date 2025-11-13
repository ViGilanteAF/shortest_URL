import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CountEntity } from '../../counter/entity/count.entity';
import { LoadUpdateCountPort } from '../port/out/load-update-count.port';

@Injectable()
export class CountAdapter implements LoadUpdateCountPort {
  constructor(
    @InjectModel(CountEntity.name)
    private readonly countModel: Model<CountEntity>,
  ) {}

  async findCountIncrease(): Promise<number> {
    const count = await this.countModel.findOneAndUpdate(
      {},
      { $inc: { current: 1 } },
    );

    if (!count) {
      throw new Error('Count document not found');
    }

    return count.current;
  }
}
