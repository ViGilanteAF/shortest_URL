import { ShortestUrl } from '../../domain/shortest-url';

export abstract class ShortestUrlCommandPort {
  abstract save(shortestUrl: ShortestUrl): Promise<ShortestUrl>;
  abstract increaseVisitCount(shortestUrlId: string): Promise<void>;
}
