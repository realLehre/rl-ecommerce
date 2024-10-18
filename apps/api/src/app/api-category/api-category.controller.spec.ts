import { Test, TestingModule } from '@nestjs/testing';
import { ApiCategoryController } from './api-category.controller';

describe('ApiCategoryController', () => {
  let controller: ApiCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiCategoryController],
    }).compile();

    controller = module.get<ApiCategoryController>(ApiCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
