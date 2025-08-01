import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { QueryFiltersDto } from '../dto/query-filters.dto';
import { PaginatedProductsResponse } from '../interfaces/product.interface';
export declare class ProductQueryService {
    private productModel;
    constructor(productModel: Model<Product>);
    getAllProducts(page?: number, limit?: number): Promise<PaginatedProductsResponse>;
    searchProducts(filters: QueryFiltersDto): Promise<PaginatedProductsResponse>;
}
