import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApiProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        subCategory: true,
        ratings: true,
      },
    });
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
        ratings: true,
      },
    });
  }

  async getSimilarProducts(categoryId: string, productId: string) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        id: {
          not: productId,
        },
      },
    });
  }

  async addProduct(data: any) {
    await this.prisma.product.create({
      data: data,
    });
  }
}
