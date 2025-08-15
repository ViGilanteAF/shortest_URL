import { ShortestUrl } from '../../domain/shortest-url';
import { CreateShortestUrlCommand } from './create-shortest-url-command';

export abstract class CreateShortestUrlUseCase {
  abstract execute(command: CreateShortestUrlCommand): Promise<ShortestUrl>;
}
