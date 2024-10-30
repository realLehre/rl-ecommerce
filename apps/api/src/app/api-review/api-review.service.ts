import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
export interface IReview {
  rating: number;
  title: string;
  comment: string;
  productId: string;
  orderItemId: string;
  userId: string;
}

@Injectable()
export class ApiReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(data: IReview) {
    return this.prisma.productRating.create({
      data,
    });
  }
}
