import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../schemas/product.schema';
export declare class ProductService {
    private productModel;
    constructor(productModel: Model<Product>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findAllWithFilters(filters: {
        search?: string;
        startDate?: string;
        endDate?: string;
        category?: string;
        brand?: string;
        status?: string;
        minPrice?: number;
        maxPrice?: number;
        isFeatured?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    searchByDateRange(startDate: string, endDate: string): Promise<Product[]>;
    searchByText(searchTerm: string): Promise<Product[]>;
}
