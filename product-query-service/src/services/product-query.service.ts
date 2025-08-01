import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { QueryFiltersDto } from '../dto/query-filters.dto';
import { PaginatedProductsResponse } from '../interfaces/product.interface';

@Injectable()
export class ProductQueryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  async getAllProducts(page: number = 1, limit: number = 10): Promise<PaginatedProductsResponse> {
    try {
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        this.productModel.find().skip(skip).limit(limit).exec(),
        this.productModel.countDocuments().exec()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: products,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error('Failed to fetch products from database');
    }
  }

  async searchProducts(filters: QueryFiltersDto): Promise<PaginatedProductsResponse> {
    try {
      const query: any = {};

      // Search by product name, description, brand, SKU, or tags
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { brand: { $regex: filters.search, $options: 'i' } },
          { sku: { $regex: filters.search, $options: 'i' } },
          { tags: { $in: [new RegExp(filters.search, 'i')] } }
        ];
      }

      // Filter by category
      if (filters.category) {
        query.category = filters.category;
      }

      // Filter by brand
      if (filters.brand) {
        query.brand = { $regex: filters.brand, $options: 'i' };
      }

      // Filter by status
      if (filters.status) {
        query.status = filters.status;
      }

      // Filter by price range
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) {
          query.price.$gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          query.price.$lte = filters.maxPrice;
        }
      }

      // Filter by featured status
      if (filters.isFeatured !== undefined) {
        query.isFeatured = filters.isFeatured;
      }

      // Filter by date range
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      const { page = 1, limit = 10 } = filters;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        this.productModel.find(query).skip(skip).limit(limit).exec(),
        this.productModel.countDocuments(query).exec()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: products,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products from database');
    }
  }
} 