import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Product } from '../interfaces/product.interface';
import { QueryFiltersDto } from '../dto/query-filters.dto';
import { PaginatedProductsResponse } from '../interfaces/product.interface';

@Injectable()
export class ProductQueryService {
  constructor(
    @Inject('PRODUCT_SERVICE') private productServiceClient: ClientProxy
  ) {}

  async getAllProducts(page: number = 1, limit: number = 10): Promise<PaginatedProductsResponse> {
    try {
      // Use TCP call to get data from Product Service
      const products = await this.productServiceClient.send({ cmd: 'get_all_products' }, {}).toPromise();
      
      // Apply pagination locally
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = products.slice(startIndex, endIndex);
      
      const total = products.length;
      const totalPages = Math.ceil(total / limit);

      return {
        data: paginatedProducts,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error('Error fetching all products via TCP:', error);
      throw new Error('Failed to fetch products from Product Service');
    }
  }

  async searchProducts(filters: QueryFiltersDto): Promise<PaginatedProductsResponse> {
    try {
      // Use TCP call to get filtered data from Product Service
      const result = await this.productServiceClient.send({ cmd: 'get_products_with_filters' }, {
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate,
        category: filters.category,
        brand: filters.brand,
        status: filters.status,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        isFeatured: filters.isFeatured,
        page: filters.page || 1,
        limit: filters.limit || 10
      }).toPromise();

      return result;
    } catch (error) {
      console.error('Error searching products via TCP:', error);
      throw new Error('Failed to search products from Product Service');
    }
  }

  // Additional methods for specific searches
  async searchByDateRange(startDate: string, endDate: string): Promise<Product[]> {
    try {
      return await this.productServiceClient.send({ cmd: 'search_by_date_range' }, {
        startDate,
        endDate
      }).toPromise();
    } catch (error) {
      console.error('Error searching by date range via TCP:', error);
      throw new Error('Failed to search by date range from Product Service');
    }
  }

  async searchByText(searchTerm: string): Promise<Product[]> {
    try {
      return await this.productServiceClient.send({ cmd: 'search_by_text' }, {
        searchTerm
      }).toPromise();
    } catch (error) {
      console.error('Error searching by text via TCP:', error);
      throw new Error('Failed to search by text from Product Service');
    }
  }
} 