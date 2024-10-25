export interface ICart {
  id: string;
  userId: string;
  subTotal: number;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;
  cartItems: ICartItems[];
}
export interface ICartItemProduct {
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
export interface ICartItems {
  id: string;
  total: number;
  unit: number;
  cartId: string;
  productId: string;
  shippingCost: number;
  updatedAt: string;
  createdAt: string;
  product: ICartItemProduct;
}
