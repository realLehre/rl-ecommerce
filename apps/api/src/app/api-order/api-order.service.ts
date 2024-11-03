import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../prisma.service';

interface ICart {
  id: string;
  userId: string;
  subTotal: number;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;
  cartItems: ICartItems[];
}
interface ICartItemProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  imageUrls: string[];
  videoUrls: any[];
  price: number;
  previousPrice: number;
  isSoldOut: boolean;
  unit: number;
  categoryId: string;
  subCategoryId: string;
  createdAt: string;
  updateAt: string;
}
interface ICartItems {
  id: string;
  total: number;
  unit: number;
  cartId: string;
  productId: string;
  shippingCost: number;
  updatedAt: string;
  createdAt: string;
  product: ICartItemProduct;
  rating?: any;
}

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
  eventUsed!: any;
  constructor(private prisma: PrismaService) {}

  async getOrder(
    userId: string,
    filters: {
      orderId?: string;
      minPrice?: number;
      maxPrice?: number;
      minDate?: any;
      maxDate?: any;
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
        createdAt: {
          gte: filters.minDate || undefined,
          lte: filters.maxDate || undefined,
        },
        deliveryStatus: filters.deliveryStatus || undefined,
        id: {
          contains: filters.orderId,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        shippingInfo: true,
        orderItems: {
          include: {
            rating: true,
          },
        },
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
        user: true,
        shippingInfo: true,
        orderItems: {
          include: {
            rating: true,
          },
        },
      },
    });
  }

  async createOrder(data: IOrderBody) {
    const order = this.prisma.$transaction(async (tx) => {
      // make order
      return tx.order.create({
        data: {
          userId: data.userId,
          cartOrder: data.cart as any,
          shippingInfoId: data.shippingInfoId,
          orderAmount: data.orderAmount,
          shippingCost: data.shippingCost,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          orderStatus: 'CONFIRMED',
          deliveryStatus: this.determineDeliveryStatus(
            this.generateDeliveryEvents(),
          ),
          orderItems: {
            create: data.cart.cartItems.map((cartItem: any) => ({
              productId: cartItem.productId,
              total: cartItem.total,
              unit: cartItem.unit,
            })),
          },
          deliveryEvents: this.eventUsed,
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

  generateDeliveryEvents(): any {
    const thirdStatus = Math.random() > 0.5 ? 'PACKED' : null;
    const fourthStatus =
      Math.random() > 0.5 && thirdStatus !== null ? 'DELIVERED' : null;

    return [
      {
        id: uuidv4(),
        remark: 'Customer paid',
        status: 'PAID',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        remark: 'Order confirmed',
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        remark: 'Order assigned for delivery',
        status: thirdStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        remark: 'Order delivered',
        status: fourthStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  determineDeliveryStatus(events: any) {
    this.eventUsed = events;
    const lastEvent = [...events]
      .reverse()
      .find((event) => event.status !== null);

    switch (lastEvent?.status) {
      case 'CONFIRMED':
        return 'PENDING';
      case 'PACKED':
        return 'PACKED';
      case 'DELIVERED':
        return 'DELIVERED';
      default:
        return 'DELIVERED'; // Default if no events have a non-null status
    }
  }
}
