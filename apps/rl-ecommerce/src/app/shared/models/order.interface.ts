import { ICartItems } from './cart.interface';

export interface IOrderBody {
  userId: string;
  cartId: string;
  shippingInfoId: string;
  orderAmount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  deliveryStatus: string;
}

export interface IOrderResponse {
  currentPage: number;
  totalItems: number;
  orders: IOrder[];
  totalItemsInPage: number;
  totalPages: number;
}

export interface ICartOrder {
  id: string;
  userId: string;
  orderId?: any;
  subTotal: number;
  cartItems: ICartItems[];
  createdAt: string;
  updatedAt: string;
  shippingCost: number;
}
export interface IDeliveryEvents {
  id: string;
  orderId: string;
  dateTime: string;
  remark: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface IOrder {
  id: string;
  userId: string;
  cartOrder: ICartOrder;
  shippingInfoId: string;
  orderAmount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  deliveryStatus: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  deliveryEvents: IDeliveryEvents[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  updateAt: string;
}
