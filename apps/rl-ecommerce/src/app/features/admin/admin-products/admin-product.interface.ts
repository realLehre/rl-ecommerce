import {
  ICategory,
  ISubCategory,
} from '../../products/model/product.interface';

export interface IAdminProductFilter {
  minPrice?: number;
  maxPrice?: number;
  pageSize: number;
  page?: number;
  productId?: string;
  productName?: string;
  category?: ICategory;
  subCategory?: ISubCategory;
  minDate?: any;
  maxDate?: any;
  name?: string;
}

export interface IProductImages {
  hasUploaded: boolean;
  isUploading: boolean;
  selectedFile: File | null;
  imageUrl: string;
}

export interface IProductFormData {
  name: string;
  description: string;
  image: string;
  imageUrls: string[];
  videoUrls: string[];
  price: number;
  previousPrice: number;
  isSoldOut: boolean;
  unit: number;
  categoryId: string;
  subCategoryId?: string;
}
