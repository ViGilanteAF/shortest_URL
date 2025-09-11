import { ShortestUrl } from '../../domain/shortest-url';

export abstract class QueryShortestUrlPort {
  abstract findShortestUrlByKey(
    shortestUrlKey: string,
  ): Promise<ShortestUrl | null>;
  abstract findShortestUrls(
    skip: number,
    limit: number,
  ): Promise<ShortestUrl[]>;
  abstract count(): Promise<number>;
}
