import { Injectable, NotFoundException } from '@nestjs/common';
import { ShortestUrlCommandPort } from './port/out/shortest-url-command.port';
import { QueryShortestUrlPort } from './port/out/shortest-url-query.port';

@Injectable()
export class GetOriginalUrlService implements GetOriginalUrlService {
  constructor(
    private readonly queryShortestUrlPort: QueryShortestUrlPort,
    private readonly shortestUrlCommandPort: ShortestUrlCommandPort,
  ) {}

  async execute(shortestUrlKey: string): Promise<string> {
    /**
     * 단축 URL 검색
     */
    const shortestUrl = await this.queryShortestUrlPort.findShortestUrlByKey(
      shortestUrlKey,
    );
    if (!shortestUrl) {
      throw new NotFoundException('등록되지 않은 URL 입니다.');
    }
    /**
     * 단축 URL 조회 횟수 증가
     */
    await this.shortestUrlCommandPort.increaseVisitCount(shortestUrl.id);

    return shortestUrl.originalUrl;
  }
}
