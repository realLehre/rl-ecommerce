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
