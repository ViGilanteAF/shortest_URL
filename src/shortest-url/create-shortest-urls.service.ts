import { Injectable } from '@nestjs/common';
import { ShortestUrl } from './domain/shortest-url';
import { GetShortestUrlsUseCase } from './port/in/get-shortest-urls.use-case';
import { LoadShortestUrlPort } from './port/out/load-shortest-url.port';

@Injectable()
export class GetShortestUrlsService implements GetShortestUrlsUseCase {
  constructor(private readonly loadShortestUrlPort: LoadShortestUrlPort) {}

  async execute(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ shortestUrls: ShortestUrl[]; totalCount: number }> {
    const [shortestUrls, totalCount] = await Promise.all([
      this.loadShortestUrlPort.findShortestUrls(
        (pageNumber - 1) * pageSize,
        pageSize,
      ),
      this.loadShortestUrlPort.count(),
    ]);
    return { shortestUrls, totalCount };
  }
}
