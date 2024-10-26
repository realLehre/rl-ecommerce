import { Test, TestingModule } from '@nestjs/testing';
import { ApiOrderController } from './api-order.controller';

describe('ApiOrderController', () => {
  let controller: ApiOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiOrderController],
    }).compile();

    controller = module.get<ApiOrderController>(ApiOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
