import { ProductCategory, ProductStatus } from '../interfaces/product.interface';
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
