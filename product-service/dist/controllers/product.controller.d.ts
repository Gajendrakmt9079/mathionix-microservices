import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../schemas/product.schema';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    searchByFilters(category?: string, name?: string, startDate?: string, endDate?: string): Promise<Product[]>;
    getAllProducts(): Promise<Product[]>;
    searchProducts(filters: {
        category?: string;
        name?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<Product[]>;
    createProduct(createProductDto: CreateProductDto): Promise<Product>;
}
