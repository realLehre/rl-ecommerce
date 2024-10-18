import { Test, TestingModule } from '@nestjs/testing';
import { ApiCategoryService } from './api-category.service';

describe('ApiCategoryService', () => {
  let service: ApiCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiCategoryService],
    }).compile();

    service = module.get<ApiCategoryService>(ApiCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
