import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortestUrl } from '../domain/shortest-url';
import { CreateShortestUrlPort } from '../port/out/create-shortest-url.port';
import { LoadShortestUrlPort } from '../port/out/load-shortest-url.port';
import { ShortestUrlEntity } from './shortest-url.entity';
import { ShortestUrlMapper } from './shortest-url.mapper';

export abstract class ShortestUrlRepository {
  abstract increaseVisitCountByKey(shortestUrlKey: string): Promise<void>;
}

@Injectable()
export class ShortestUrlRepositoryImpl
  implements LoadShortestUrlPort, CreateShortestUrlPort, ShortestUrlRepository
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

  async createShortestUrl(shortestUrl: ShortestUrl): Promise<ShortestUrl> {
    const shortestUrlEntity = new this.shortestUrlModel(shortestUrl);
    await shortestUrlEntity.save();
    return ShortestUrlMapper.entityToDomain(shortestUrlEntity);
  }

  async increaseVisitCountByKey(shortestUrlKey: string): Promise<void> {
    await this.shortestUrlModel.updateOne(
      { key: shortestUrlKey },
      { $inc: { visitCount: 1 } },
    );
  }
}
