export interface IProduct {
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
  category: ICategory;
  subCategory: ISubCategory;
  ratings: IProductRating[];
}
export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
  subCategories?: ISubCategory[];
}
export interface ISubCategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updateAt: string;
}

export interface IProductResponse {
  products: IProduct[];
  totalItems: number;
  totalItemsInPage: number;
  currentPage: number;
  totalPages: number;
}

export interface IProductRating {
  id: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  productId: string;
  orderItemId: string;
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
    createdAt: string;
    updateAt: string;
  };
}
