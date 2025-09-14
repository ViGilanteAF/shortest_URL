import { Injectable } from '@nestjs/common';
import { ShortestUrl } from './domain/shortest-url';
import { GetShortestUrlsUseCase } from './port/in/get-shortest-urls.use-case';
import { QueryShortestUrlPort } from './port/out/shortest-url-query.port';

@Injectable()
export class GetShortestUrlsService implements GetShortestUrlsUseCase {
  constructor(private readonly queryShortestUrlPort: QueryShortestUrlPort) {}

  async execute(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ shortestUrls: ShortestUrl[]; totalCount: number }> {
    const [shortestUrls, totalCount] = await Promise.all([
      this.queryShortestUrlPort.findShortestUrls(
        (pageNumber - 1) * pageSize,
        pageSize,
      ),
      this.queryShortestUrlPort.count(),
    ]);
    return { shortestUrls, totalCount };
  }
}
