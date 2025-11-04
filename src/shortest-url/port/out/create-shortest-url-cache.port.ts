import { ShortestUrl } from '../../domain/shortest-url';

export abstract class CreateShortestUrlCachePort {
  abstract createShortestUrlCache(shortestUrl: ShortestUrl): Promise<void>;
}
