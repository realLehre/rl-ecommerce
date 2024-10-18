import { Test, TestingModule } from '@nestjs/testing';
import { ApiProductController } from './api-product.controller';

describe('ApiProductController', () => {
  let controller: ApiProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiProductController],
    }).compile();

    controller = module.get<ApiProductController>(ApiProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
