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
  ratings: any[];
}
export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
}
export interface ISubCategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updateAt: string;
}
