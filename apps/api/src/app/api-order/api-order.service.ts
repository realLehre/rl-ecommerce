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

  async getOrder(
    userId: string,
    filters: {
      orderId?: string;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      pageSize?: number;
      deliveryStatus?: any;
    },
  ) {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const orders = await this.prisma.order.findMany({
      where: {
        userId: userId,
        totalAmount: {
          gte: filters.minPrice || undefined,
          lte: filters.maxPrice || undefined,
        },
        deliveryStatus: filters.deliveryStatus || undefined,
        id: {
          contains: filters.orderId,
          mode: 'insensitive',
        },
      },
      include: {
        user: true,
        deliveryEvents: true,
        shippingInfo: true,
      },
      skip,
      take: pageSize,
    });

    const totalItems = await this.prisma.order.count({
      where: {
        userId: userId,
        totalAmount: {
          gte: filters.minPrice || undefined,
          lte: filters.maxPrice || undefined,
        },
      },
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      orders,
      totalItems,
      totalItemsInPage: orders.length,
      currentPage: page,
      totalPages,
    };
  }

  async getOrderById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        deliveryEvents: true,
        user: true,
        shippingInfo: true,
      },
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
                status: 'CONFIRMED',
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
