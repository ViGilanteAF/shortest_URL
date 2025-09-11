import { Injectable } from '@nestjs/common';
import { ShortestUrl } from './domain/shortest-url';
import { GetShortestUrlsQuery } from './port/in/get-shortest-urls.query';
import { GetShortestUrlsUseCase } from './port/in/get-shortest-urls.use-case';
import { QueryShortestUrlPort } from './port/out/shortest-url-query.port';

@Injectable()
export class GetShortestUrlsService implements GetShortestUrlsUseCase {
  constructor(private readonly queryShortestUrlPort: QueryShortestUrlPort) {}

  async execute(
    query: GetShortestUrlsQuery,
  ): Promise<{ shortestUrls: ShortestUrl[]; totalCount: number }> {
    const [shortestUrls, totalCount] = await Promise.all([
      this.queryShortestUrlPort.findShortestUrls(
        (query.pageNumber - 1) * query.pageSize,
        query.pageSize,
      ),
      this.queryShortestUrlPort.count(),
    ]);
    return { shortestUrls, totalCount };
  }
}
