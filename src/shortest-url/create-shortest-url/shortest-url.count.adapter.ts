import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountEntity } from '../../counter/entity/count.entity';
import { CountCommandPort } from '../port/out/command-count.port';

@Injectable()
export class CountAdapter implements CountCommandPort {
  constructor(
    @InjectModel(CountEntity.name)
    private readonly countModel: Model<CountEntity>,
  ) {}

  async findCountAndIncrease(): Promise<number> {
    const count = await this.countModel.findOneAndUpdate(
      {},
      { $inc: { current: 1 } },
    );
    return count!.current;
  }
}
