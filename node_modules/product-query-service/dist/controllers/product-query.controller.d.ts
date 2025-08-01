import { ProductQueryService } from "../services/product-query.service";
import { QueryFiltersDto } from "../dto/query-filters.dto";
import { PaginatedProductsResponse } from "../interfaces/product.interface";
export declare class ProductQueryController {
    private readonly productQueryService;
    constructor(productQueryService: ProductQueryService);
    getAllProducts(page?: string, limit?: string): Promise<PaginatedProductsResponse>;
    searchProducts(filters: QueryFiltersDto): Promise<PaginatedProductsResponse>;
    searchByDateRange(startDate: string, endDate: string): Promise<import("../interfaces/product.interface").Product[]>;
    searchByText(searchTerm: string): Promise<import("../interfaces/product.interface").Product[]>;
}
