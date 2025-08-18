import { Injectable } from '@nestjs/common';
import { ShortestUrl } from './domain/shortest-url';
import { CreateShortestUrlCommand } from './port/in/create-shortest-url-command';
import { CreateShortestUrlUseCase } from './port/in/create-shortest-url.use-case';
import { GetCount } from './port/in/get-count';
import { ShortestUrlCommand } from './port/out/shortest-url-command';

@Injectable()
export class CreateShortestUrlService implements CreateShortestUrlUseCase {
  constructor(
    private readonly getCount: GetCount,
    private readonly ShortestUrlCommand: ShortestUrlCommand,
  ) {}

  async execute(command: CreateShortestUrlCommand): Promise<ShortestUrl> {
    /**
     * 단축 URL 키값 생성
     */
    const shortestUrlKey = await this.generateShortestUrlKey();

    /**
     * 단축 URL 생성
     */
    const shortestUrl = ShortestUrl.builder()
      .set('key', shortestUrlKey)
      .set('originalUrl', command.originalUrl)
      .build();

    /**
     * 단축 URL 저장
     */
    return this.ShortestUrlCommand.save(shortestUrl);
  }

  /**
   * base64 인코딩
   */
  private numberToBase64(n: number): string {
    const base64urlChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    for (let i = 0; i < 7; i++) {
      const index = n % 64;
      result = base64urlChars[index] + result;
      n = Math.floor(n / 64);
    }
    return result;
  }

  /**
   * 단축 URL키 생성 함수
   */
  private async generateShortestUrlKey(): Promise<string> {
    //count 조회
    const count = await this.getCount.execute();

    //count를 base64로 인코딩
    return this.numberToBase64(count);
  }
}
