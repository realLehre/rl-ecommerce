import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAddressDto } from './create-address.dto';

@Injectable()
export class ApiAddressService {
  constructor(private prisma: PrismaService) {}

  async getAddress(userId: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        addresses: true,
      },
    });
  }

  async deleteAddress(id: string) {
    return this.prisma.address.delete({
      where: { id },
    });
  }

  async addAddress(userId: string, data: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async editAddress(id: string, data: CreateAddressDto) {
    return this.prisma.address.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
}
