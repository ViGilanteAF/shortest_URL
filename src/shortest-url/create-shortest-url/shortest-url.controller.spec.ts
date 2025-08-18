import { Test, TestingModule } from '@nestjs/testing';
import { ShortestUrlController } from './shortest-url.controller';

describe('ShortestUrlController', () => {
  let controller: ShortestUrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortestUrlController],
    }).compile();

    controller = module.get<ShortestUrlController>(ShortestUrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
