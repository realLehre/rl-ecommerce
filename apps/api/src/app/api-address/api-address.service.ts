import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAddressDto } from './create-address.dto';

@Injectable()
export class ApiAddressService {
  constructor(private prisma: PrismaService) {}

  async getAddress(userId: string): Promise<any> {
    return this.prisma.address.findMany({
      where: { userId: userId },

      orderBy: {
        isDefault: 'desc',
      },
    });
  }

  async deleteAddress(id: string) {
    return this.prisma.address.delete({
      where: { id },
    });
  }

  async addAddress(userId: string, data: CreateAddressDto) {
    if (data.isDefault) {
      return this.prisma.$transaction([
        this.prisma.address.updateMany({
          where: { userId },
          data: {
            isDefault: false,
          },
        }),

        this.prisma.address.create({
          data: {
            ...data,
            userId,
          },
        }),
      ]);
    }
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

  async setDefaultAddress(userId: string, addressId: string): Promise<any> {
    return this.prisma.$transaction([
      // Update all addresses for the user to isDefault = false
      this.prisma.address.updateMany({
        where: {
          userId: userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      }),
      // Set the selected address as default
      this.prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          isDefault: true,
        },
      }),
    ]);
  }
}
