import { Test, TestingModule } from '@nestjs/testing';
import { CreateShortestUrlService } from './create-shortest-url.service';

describe('CreateShortestUrlService', () => {
  let service: CreateShortestUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateShortestUrlService],
    }).compile();

    service = module.get<CreateShortestUrlService>(CreateShortestUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
