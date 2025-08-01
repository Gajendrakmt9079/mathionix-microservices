import { Document } from 'mongoose';
export declare enum ProductCategory {
    ELECTRONICS = "electronics",
    CLOTHING = "clothing",
    BOOKS = "books",
    HOME = "home",
    SPORTS = "sports",
    FOOD = "food",
    BEAUTY = "beauty",
    AUTOMOTIVE = "automotive"
}
export declare enum ProductStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISCONTINUED = "discontinued",
    OUT_OF_STOCK = "out_of_stock"
}
export declare class Product extends Document {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    brand: string;
    sku: string;
    status: ProductStatus;
    weightInGrams: number;
    images: string[];
    tags: string[];
    specifications: Record<string, string>;
    isFeatured: boolean;
    releaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Product> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
