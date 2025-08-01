import { ProductCategory, ProductStatus } from '../schemas/product.schema';
export declare class QueryFiltersDto {
    category?: ProductCategory;
    brand?: string;
    status?: ProductStatus;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
