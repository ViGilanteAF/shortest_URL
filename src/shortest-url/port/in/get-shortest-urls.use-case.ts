import { ShortestUrl } from '../../domain/shortest-url';

export abstract class GetShortestUrlsUseCase {
  abstract execute(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ shortestUrls: ShortestUrl[]; totalCount: number }>;
}
