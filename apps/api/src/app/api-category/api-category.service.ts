import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApiCategoryService {
  constructor(private prisma: PrismaService) {}

  async addCategory(data: { name: string; subCategories?: string[] }) {
    await this.prisma.category.create({
      data: {
        name: data.name,
        subCategories: {
          create: data?.subCategories?.map((subCategoryName) => ({
            name: subCategoryName,
          })),
        },
      },
    });
  }
}
