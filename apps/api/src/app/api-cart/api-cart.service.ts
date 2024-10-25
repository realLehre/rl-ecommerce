import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApiCartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          subTotal: 0,
          shippingCost: 0,
        },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async addItemToCart(unit: number, productId: string, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      const cart = await this.getOrCreateCart(userId);

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          unit,
          total: product!.price * unit,
          shippingCost: 100, // Default shipping cost
        },
      });
    });
  }

  async updateCartItem(itemId: string, unit: number, productPrice: number) {
    return this.prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        unit,
        total: productPrice * unit,
      },
    });
  }
}
