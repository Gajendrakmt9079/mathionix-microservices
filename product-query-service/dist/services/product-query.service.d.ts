import { ClientProxy } from '@nestjs/microservices';
import { Product } from '../interfaces/product.interface';
import { QueryFiltersDto } from '../dto/query-filters.dto';
import { PaginatedProductsResponse } from '../interfaces/product.interface';
export declare class ProductQueryService {
    private productServiceClient;
    constructor(productServiceClient: ClientProxy);
    getAllProducts(page?: number, limit?: number): Promise<PaginatedProductsResponse>;
    searchProducts(filters: QueryFiltersDto): Promise<PaginatedProductsResponse>;
    searchByDateRange(startDate: string, endDate: string): Promise<Product[]>;
    searchByText(searchTerm: string): Promise<Product[]>;
}
