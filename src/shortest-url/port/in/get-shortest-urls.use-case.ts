import { ShortestUrl } from '../../domain/shortest-url';
import { GetShortestUrlsQuery } from './get-shortest-urls.query';

export abstract class GetShortestUrlsUseCase {
  abstract execute(
    query: GetShortestUrlsQuery,
  ): Promise<{ shortestUrls: ShortestUrl[]; totalCount: number }>;
}
