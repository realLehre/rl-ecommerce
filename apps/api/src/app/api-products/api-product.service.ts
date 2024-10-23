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
    page?: number;
    pageSize?: number;
  }) {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const products = await this.prisma.product.findMany({
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
      skip,
      take: pageSize,
    });

    const totalItems = await this.prisma.product.count({
      where: {
        categoryId: filters.categoryId || undefined,
        subCategoryId: filters.subCategoryId || undefined,
        price: {
          gte: filters.minPrice || undefined,
          lte: filters.maxPrice || undefined,
        },
      },
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      products,
      totalItems,
      totalItemsInPage: products.length,
      currentPage: page,
      totalPages,
    };
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

  async searchProducts(input: string) {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: input,
          mode: 'insensitive',
        },
      },
      take: 5,
    });
  }
}
