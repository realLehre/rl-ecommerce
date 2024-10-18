import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApiProductService {
  constructor(private prisma: PrismaService) {}

  async addProduct(data: any) {
    await this.prisma.product.create({
      data: data,
    });
  }
}
