import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Product } from '../interfaces/product.interface';
import { QueryFiltersDto } from '../dto/query-filters.dto';

@Injectable()
export class ProductQueryService {
  constructor(
    @Inject('PRODUCT_SERVICE') private productServiceClient: ClientProxy
  ) {}

  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('🔍 Query Service: Making TCP call to get all products...');
      // Use TCP call to get data from Product Service
      const result = await this.productServiceClient.send({ cmd: 'get_all_products' }, {}).toPromise();
      console.log('✅ Query Service: Successfully received products via TCP');
      return result;
    } catch (error) {
      console.error('❌ Query Service: Error fetching all products via TCP:', error);
      throw new Error(`Failed to fetch products from Product Service: ${error.message}`);
    }
  }

  async searchProducts(filters: QueryFiltersDto): Promise<Product[]> {
    try {
      console.log('🔍 Query Service: Making TCP call to search products with filters:', filters);
      // Use TCP call to get filtered data from Product Service
      const result = await this.productServiceClient.send({ cmd: 'search_products' }, {
        category: filters.category,
        name: filters.name,
        startDate: filters.startDate,
        endDate: filters.endDate
      }).toPromise();
      console.log('✅ Query Service: Successfully received search results via TCP');
      return result;
    } catch (error) {
      console.error('❌ Query Service: Error searching products via TCP:', error);
      throw new Error(`Failed to search products from Product Service: ${error.message}`);
    }
  }
} 