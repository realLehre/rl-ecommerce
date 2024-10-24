import { Test, TestingModule } from '@nestjs/testing';
import { ApiCartController } from './api-cart.controller';

describe('ApiCartController', () => {
  let controller: ApiCartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiCartController],
    }).compile();

    controller = module.get<ApiCartController>(ApiCartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
