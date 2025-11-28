import { Injectable, NotFoundException } from '@nestjs/common';
import { GetOriginalUrlUseCase } from './port/in/get-original-url.use-case';
import { CreateShortestUrlCachePort } from './port/out/create-shortest-url-cache.port';
import { LoadShortestUrlCachePort } from './port/out/load-shortest-url-cache.port';
import { LoadShortestUrlPort } from './port/out/load-shortest-url.port';
import { UpdateShortestUrlPort } from './port/out/update-shortest-url.port';

@Injectable()
export class GetOriginalUrlServiceImpl implements GetOriginalUrlUseCase {
  constructor(
    private readonly loadShortestUrlPort: LoadShortestUrlPort,
    private readonly updateShortestUrlPort: UpdateShortestUrlPort,
    private readonly loadShortestUrlCachePort: LoadShortestUrlCachePort,
    private readonly createShortestUrlCachePort: CreateShortestUrlCachePort,
  ) {}

  async execute(shortestUrlKey: string): Promise<string> {
    /**
     * 단축 URL 검색
     */
    const shortestUrl =
      await this.loadShortestUrlCachePort.findShortestUrlCache(shortestUrlKey);
    if (shortestUrl) {
      console.log('Cache!!');
    }
    if (!shortestUrl) {
      /**
       * DB 검색
       */
      if (!shortestUrl) {
        throw new NotFoundException('저장되지 않은 URL입니다.');
      }

      /**
       * Cache 생성
       */
      await this.createShortestUrlCachePort.createShortestUrlCache(shortestUrl);
    }
    /**
     * 단축 URL 조회 횟수 증가
     */
    await this.updateShortestUrlPort.increaseVisitCountByKey(shortestUrl.key);

    return shortestUrl.originalUrl;
  }
}
