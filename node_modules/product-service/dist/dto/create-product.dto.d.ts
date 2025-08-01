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
export declare class CreateProductDto {
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
    releaseDate?: string;
}
