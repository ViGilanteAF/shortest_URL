import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortestUrl } from '../domain/shortest-url';
import { ShortestUrlCommandPort } from '../port/out/shortest-url-command';
import { ShortestUrlEntity } from './shortest-url.entity';
import { ShortestUrlMapper } from './shortest-url.mapper';

@Injectable()
export class ShortestUrlCommandAdapter implements ShortestUrlCommandPort {
  constructor(
    @InjectModel(ShortestUrlEntity.name)
    private readonly shortestUrlModel: Model<ShortestUrlEntity>,
  ) {}

  async save(shortestUrl: ShortestUrl): Promise<ShortestUrl> {
    const shortestUrlEntity = new this.shortestUrlModel(shortestUrl);
    await shortestUrlEntity.save();
    return ShortestUrlMapper.entityToDomain(shortestUrlEntity);
  }

  async increaseVisitCount(shortestUrlId: string): Promise<void> {
    await this.shortestUrlModel.updateOne(
      { _id: shortestUrlId },
      { $inc: { visitCount: 1 } },
    );
  }
}
