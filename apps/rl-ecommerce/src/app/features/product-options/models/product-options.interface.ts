export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
  subCategories: ISubCategory[];
  _count: { products: number };
}
export interface ISubCategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updateAt: string;
}

export interface ISavedProductOptionQueries {
  category?: ICategory;
  subCategory?: ISubCategory;
  page?: number;
  maxPrice?: number;
  minPrice?: number;
  sort?: string;
  rating?: number;
}

export interface IProductFilter {
  category?: ICategory;
  subCategory?: ISubCategory;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  rating?: number;
}
