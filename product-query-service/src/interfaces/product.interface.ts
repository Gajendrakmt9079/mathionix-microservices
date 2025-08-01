export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home',
  SPORTS = 'sports',
  FOOD = 'food',
  BEAUTY = 'beauty',
  AUTOMOTIVE = 'automotive',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
  OUT_OF_STOCK = 'out_of_stock',
}

export interface Product {
  _id?: any;
  id?: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  brand: string;
  sku: string;
  status: ProductStatus;
  weightInGrams: number;
  images?: string[];
  tags?: string[];
  specifications?: Record<string, string>;
  isFeatured?: boolean;
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface PaginatedProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} 