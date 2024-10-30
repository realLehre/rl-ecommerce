import { Body, Controller, Post } from '@nestjs/common';
import { ApiReviewService, IReview } from './api-review.service';

@Controller('review')
export class ApiReviewController {
  constructor(private reviewService: ApiReviewService) {}

  @Post('create')
  async createReview(@Body() data: IReview) {
    return this.reviewService.createReview(data);
  }
}
