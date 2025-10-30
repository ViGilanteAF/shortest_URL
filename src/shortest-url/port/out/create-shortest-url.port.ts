import { ShortestUrl } from '../../domain/shortest-url';

export abstract class CreateShortestUrlPort {
  abstract createShortestUrl(shortestUrl: ShortestUrl): Promise<ShortestUrl>;
}
