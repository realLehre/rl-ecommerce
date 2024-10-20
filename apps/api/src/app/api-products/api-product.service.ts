import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApiProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts(filters: {
    categoryId?: string;
    subCategoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }) {
    return this.prisma.product.findMany({
      include: {
        category: true,
        subCategory: true,
        ratings: true,
      },
      where: {
        categoryId: filters.categoryId || undefined,
        subCategoryId: filters.subCategoryId || undefined,
        price: {
          gte: filters.minPrice || undefined,
          lte: filters.maxPrice || undefined,
        },
      },
      orderBy: {
        createdAt:
          filters.sortBy === 'new'
            ? 'desc'
            : filters.sortBy === 'old'
              ? 'asc'
              : undefined,
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
