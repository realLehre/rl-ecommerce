import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface IOrderBody {
  userId: string;
  cart: any;
  shippingInfoId: string;
  orderAmount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  deliveryStatus: string;
}
@Injectable()
export class ApiOrderService {
  constructor(private prisma: PrismaService) {}

  async getOrder(userId: string) {
    return this.prisma.order.findMany({
      where: { userId: userId },
      include: {
        user: true,
        deliveryEvents: true,
        shippingInfo: true,
      },
    });
  }

  async getOrderById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  async createOrder(data: IOrderBody) {
    const order = this.prisma.$transaction(async (tx) => {
      // make order
      return tx.order.create({
        data: {
          userId: data.userId,
          cartOrder: data.cart,
          shippingInfoId: data.shippingInfoId,
          orderAmount: data.orderAmount,
          shippingCost: data.shippingCost,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          orderStatus: 'CONFIRMED',
          deliveryStatus: 'PENDING',
          deliveryEvents: {
            create: [
              {
                remark: 'Customer paid',
                status: 'PAID',
              },
              {
                remark: 'Order confirmed',
                status: null,
              },
              {
                remark: 'Order assigned for delivery',
                status: null,
              },
              {
                remark: 'Order delivered',
                status: null,
              },
            ],
          },
        },
        include: {
          deliveryEvents: true,
        },
      });
    });

    //   delete cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: data.cart.id },
    });

    //   update cart totals
    await this.prisma.cart.update({
      where: {
        id: data.cart.id,
      },
      data: {
        subTotal: 0,
        shippingCost: 0,
      },
    });

    return order;
  }
}
