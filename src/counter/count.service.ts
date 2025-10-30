import { Injectable } from '@nestjs/common';
import { CreateShortestUrlUseCase } from '../shortest-url/port/in/create-shortest-url.use-case';
import { LoadUpdateCountPort } from '../shortest-url/port/out/load-update-count.port';

@Injectable()
export class CountService implements CreateShortestUrlUseCase {
  constructor(private readonly loadUpdateCountPort: LoadUpdateCountPort) {}

  execute(): Promise<number> {
    return this.loadUpdateCountPort.findCountIncrease();
  }
}
