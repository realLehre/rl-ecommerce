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

    const subTotal = cart.cartItems.reduce((sum, item) => sum + item.total, 0);
    const shippingCost = cart.cartItems.reduce(
      (sum, item) => sum + item.shippingCost,
      0,
    );

    // Update the cart with the calculated subtotal
    cart = await this.prisma.cart.update({
      where: { id: cart.id },
      data: { subTotal, shippingCost },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return cart;
  }

  async addItemToCart(
    unit: number,
    productId: string,
    productPrice: number,
    userId: string,
  ) {
    const cart = await this.getOrCreateCart(userId);
    return this.prisma.$transaction(async (prisma) => {
      return prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          unit,
          total: productPrice * unit,
          shippingCost: 100,
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

  async mergeCart(data: any, userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return this.prisma.$transaction(async (prisma) => {
      for (const guestItem of data?.cartItems!) {
        const existingItem = cart.cartItems.find(
          (item) => item.product.id == guestItem.product.id,
        );

        if (!existingItem) {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: guestItem.product.id,
              unit: guestItem.unit,
              total: guestItem.product.price * guestItem.unit,
              shippingCost: 100,
            },
          });
        }
      }

      const subTotal = cart.cartItems.reduce(
        (sum, item) => sum + item.total,
        0,
      );
      const shippingCost = cart.cartItems.reduce(
        (sum, item) => sum + item.shippingCost,
        0,
      );
      return prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          subTotal,
          shippingCost,
        },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }

  async deleteCartItem(id: string) {
    return this.prisma.cartItem.delete({ where: { id } });
  }
}
