import { Test, TestingModule } from '@nestjs/testing';
import { ApiReviewController } from './api-review.controller';

describe('ApiReviewController', () => {
  let controller: ApiReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiReviewController],
    }).compile();

    controller = module.get<ApiReviewController>(ApiReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
