import { Injectable, NotFoundException } from '@nestjs/common';
import { LoadShortestUrlPort } from './port/out/load-shortest-url.port';
import { UpdateShortestUrlPort } from './port/out/update-shortest-url.port';

@Injectable()
export class GetOriginalUrlService implements GetOriginalUrlService {
  constructor(
    private readonly loadShortestUrlPort: LoadShortestUrlPort,
    private readonly updateShortestUrlPort: UpdateShortestUrlPort,
  ) {}

  async execute(shortestUrlKey: string): Promise<string> {
    /**
     * 단축 URL 검색
     */
    const shortestUrl = await this.loadShortestUrlPort.findShortestUrlByKey(
      shortestUrlKey,
    );
    if (!shortestUrl) {
      throw new NotFoundException('등록되지 않은 URL 입니다.');
    }
    /**
     * 단축 URL 조회 횟수 증가
     */
    await this.updateShortestUrlPort.increaseVisitCountByKey(shortestUrl.key);

    return shortestUrl.originalUrl;
  }
}
