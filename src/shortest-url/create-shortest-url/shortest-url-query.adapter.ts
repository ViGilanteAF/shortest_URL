import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortestUrl } from '../domain/shortest-url';
import { ShortestUrlCommandPort } from '../port/out/shortest-url-command.port';
import { QueryShortestUrlPort } from '../port/out/shortest-url-query.port';
import { ShortestUrlEntity } from './shortest-url.entity';
import { ShortestUrlMapper } from './shortest-url.mapper';

@Injectable()
export class ShortestUrlAdapter
  implements QueryShortestUrlPort, ShortestUrlCommandPort
{
  constructor(
    @InjectModel(ShortestUrlEntity.name)
    private readonly shortestUrlModel: Model<ShortestUrlEntity>,
  ) {}

  async findShortestUrlByKey(
    shortestUrlKey: string,
  ): Promise<ShortestUrl | null> {
    const shortestUrlEntity = await this.shortestUrlModel.findOne({
      key: shortestUrlKey,
    });
    return (
      shortestUrlEntity && ShortestUrlMapper.entityToDomain(shortestUrlEntity)
    );
  }

  async findShortestUrls(skip: number, limit: number): Promise<ShortestUrl[]> {
    const shortestUrlEntities = await this.shortestUrlModel
      .find()
      .skip(skip)
      .limit(limit);
    return ShortestUrlMapper.entitiesToDomains(shortestUrlEntities);
  }

  count(): Promise<number> {
    return this.shortestUrlModel.countDocuments();
  }

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
