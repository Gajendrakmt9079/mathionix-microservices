import { ClientProxy } from '@nestjs/microservices';
import { Product } from '../interfaces/product.interface';
import { QueryFiltersDto } from '../dto/query-filters.dto';
export declare class ProductQueryService {
    private productServiceClient;
    constructor(productServiceClient: ClientProxy);
    getAllProducts(): Promise<Product[]>;
    searchProducts(filters: QueryFiltersDto): Promise<Product[]>;
}
