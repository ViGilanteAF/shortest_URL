import { ShortestUrl } from '../../domain/shortest-url';

export abstract class ShortestUrlCommand {
  abstract save(shortestUrl: ShortestUrl): Promise<ShortestUrl>;
  abstract increaseVisitCount(shortestUrlId: string): Promise<void>;
}
