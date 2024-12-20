import { IProduct } from '../../products/model/product.interface';

export interface IDashboardAnalytics {
  totalSales: number;
  totalProducts: number;
  totalUsers: number;
}

export interface ITopSellingProductResponse {
  productId: string;
  totalUnitsSold: number;
  productDetails: IProduct;
}

export interface ISalesDataResponse {
  [key: string]: number;
}
