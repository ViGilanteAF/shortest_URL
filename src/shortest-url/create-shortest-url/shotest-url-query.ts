import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortestUrl } from '../domain/shortest-url';
import { QueryShortestUrlPort } from '../port/out/shortest-url-query.port';
import { ShortestUrlEntity } from './shortest-url.entity';
import { ShortestUrlMapper } from './shortest-url.mapper';

@Injectable()
export class QueryShortestUrl implements QueryShortestUrlPort {
  constructor(
    @InjectModel(ShortestUrlEntity.name)
    private readonly shortestUrlModel: Model<ShortestUrlEntity>,
  ) {}

  async findShortestUrl(shortestUrlKey: string): Promise<ShortestUrl | null> {
    const shortestUrlEntity = await this.shortestUrlModel.findOne({
      key: shortestUrlKey,
    });
    return (
      shortestUrlEntity && ShortestUrlMapper.entityToDomain(shortestUrlEntity)
    );
  }

  findShortestUrls(offset: number, limit: number): Promise<ShortestUrl[]> {
    throw new Error('Method not implemented.');
  }

  count(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
