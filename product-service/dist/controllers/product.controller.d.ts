import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../schemas/product.schema';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    getAllProducts(): Promise<Product[]>;
    getProductsWithFilters(filters: {
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
    searchByDateRange(data: {
        startDate: string;
        endDate: string;
    }): Promise<Product[]>;
    searchByText(data: {
        searchTerm: string;
    }): Promise<Product[]>;
    createProduct(createProductDto: CreateProductDto): Promise<Product>;
}
