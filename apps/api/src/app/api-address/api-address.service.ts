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

  async getAddressById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async addAddress(userId: string, data: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }
}
