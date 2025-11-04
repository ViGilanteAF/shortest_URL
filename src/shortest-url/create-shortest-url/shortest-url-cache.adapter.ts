import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ShortestUrl } from '../domain/shortest-url';
import { CreateShortestUrlCachePort } from '../port/out/create-shortest-url-cache.port';
import { LoadShortestUrlCachePort } from '../port/out/load-shortest-url-cache.port';

@Injectable()
export class ShortestUrlCacheAdapter
  implements LoadShortestUrlCachePort, CreateShortestUrlCachePort
{
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManage: Cache) {}

  async findShortestUrlCache(
    shortestUrlKey: string,
  ): Promise<ShortestUrl | null> {
    const originalUrl = await this.cacheManage.get(shortestUrlKey);
    return originalUrl
      ? <ShortestUrl>{ key: shortestUrlKey, originalUrl }
      : null;
  }

  async createShortestUrlCache(shortestUrl: ShortestUrl): Promise<void> {
    await this.cacheManage.set(shortestUrl.key, shortestUrl.originalUrl);
  }
}
