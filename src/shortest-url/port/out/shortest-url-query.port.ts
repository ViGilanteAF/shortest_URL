import { ShortestUrl } from '../../domain/shortest-url';

export abstract class QueryShortestUrlPort {
  abstract findShortestUrl(shortestUrlKey: string): Promise<ShortestUrl | null>;
}
