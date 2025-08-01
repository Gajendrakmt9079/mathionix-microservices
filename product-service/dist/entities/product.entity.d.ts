import { ProductCategory, ProductStatus } from '../dto/create-product.dto';
export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    brand: string;
    sku: string;
    status: ProductStatus;
    weightInGrams: number;
    images?: string[];
    tags?: string[];
    specifications?: Record<string, string>;
    isFeatured?: boolean;
    releaseDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
}
