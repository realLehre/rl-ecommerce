export interface SubCategories {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updateAt: string;
}

export interface _count {
  products: number;
}

export interface Categories {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
  subCategories: SubCategories[];
  _count: _count;
}

export interface IAdminCategoriesResponse {
  categories: Categories[];
  totalItems: number;
  totalItemsInPage: number;
  currentPage: number;
  totalPages: number;
}
