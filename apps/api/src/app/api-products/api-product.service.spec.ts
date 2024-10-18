import { Test, TestingModule } from '@nestjs/testing';
import { ApiProductService } from './api-product.service';

describe('ApiProductService', () => {
  let service: ApiProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiProductService],
    }).compile();

    service = module.get<ApiProductService>(ApiProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
