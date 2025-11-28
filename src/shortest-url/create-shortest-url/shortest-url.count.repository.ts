import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountEntity } from '../../counter/entity/count.entity';
import { LoadUpdateCountPort } from '../port/out/load-update-count.port';

@Injectable()
export class CountRepositoryImpl implements LoadUpdateCountPort {
  constructor(
    @InjectModel(CountEntity.name)
    private readonly countModel: Model<CountEntity>,
  ) {}

  async findCountIncrease(increase: number): Promise<number> {
    const count = await this.countModel.findOneAndUpdate(
      {},
      { $inc: { current: increase } },
    );

    return count?.current;
  }
}
