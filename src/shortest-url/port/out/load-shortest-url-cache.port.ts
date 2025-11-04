import { ShortestUrl } from '../../domain/shortest-url';

export abstract class LoadShortestUrlCachePort {
  abstract findShortestUrlCache(
    shortestUrlKey: string,
  ): Promise<ShortestUrl | null>;
}
