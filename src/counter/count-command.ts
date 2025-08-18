import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortestUrlCommand } from '../shortest-url/port/out/shortest-url-command';
import { CountEntity } from './entity/count.entity';

@Injectable()
export class CountCommand implements ShortestUrlCommand {
  constructor(
    @InjectModel(CountEntity.name)
    private readonly countModel: Model<CountEntity>,
  ) {}

  async findCountAndIncrease(): Promise<number> {
    const count = await this.countModel.findOneAndUpdate(
      {},
      { $inc: { current: 1 } },
    );
    return count?.current;
  }
}
