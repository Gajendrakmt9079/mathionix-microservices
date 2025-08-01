import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../schemas/product.schema';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
}
