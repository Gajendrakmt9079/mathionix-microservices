import { ProductQueryService } from "../services/product-query.service";
import { QueryFiltersDto } from "../dto/query-filters.dto";
import { Product } from "../interfaces/product.interface";
export declare class ProductQueryController {
    private readonly productQueryService;
    constructor(productQueryService: ProductQueryService);
    getAllProducts(): Promise<Product[]>;
    searchProducts(filters: QueryFiltersDto): Promise<Product[]>;
}
