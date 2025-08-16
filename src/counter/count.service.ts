import { Injectable } from '@nestjs/common';
import { CreateShortestUrlUseCase } from '../shortest-url/port/in/create-shortest-url.use-case';
import { CountCommandPort } from '../shortest-url/port/out/command-count.port';

@Injectable()
export class CountService implements CreateShortestUrlUseCase {
  constructor(private readonly countCommandPort: CountCommandPort) {}

  execute(): Promise<number> {
    return this.countCommandPort.findCountAndIncreate();
  }
}
