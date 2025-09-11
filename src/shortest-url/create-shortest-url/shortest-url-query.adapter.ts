import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortestUrl } from '../domain/shortest-url';
import { QueryShortestUrlPort } from '../port/out/shortest-url-query.port';
import { ShortestUrlEntity } from './shortest-url.entity';
import { ShortestUrlMapper } from './shortest-url.mapper';

@Injectable()
export class QueryShortestUrlAdapter implements QueryShortestUrlPort {
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
}
