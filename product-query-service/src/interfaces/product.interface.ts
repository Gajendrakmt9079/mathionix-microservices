import { ProductCategory, ProductStatus } from '../schemas/product.schema';

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