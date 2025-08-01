import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../schemas/product.schema';
export declare class ProductService {
    private productModel;
    constructor(productModel: Model<Product>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    searchByFilters(filters: {
        category?: string;
        name?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<Product[]>;
}
