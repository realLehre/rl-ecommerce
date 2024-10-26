import { Test, TestingModule } from '@nestjs/testing';
import { ApiOrderService } from './api-order.service';

describe('ApiOrderService', () => {
  let service: ApiOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiOrderService],
    }).compile();

    service = module.get<ApiOrderService>(ApiOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
