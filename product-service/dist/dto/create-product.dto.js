"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductDto = exports.ProductStatus = exports.ProductCategory = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["ELECTRONICS"] = "electronics";
    ProductCategory["CLOTHING"] = "clothing";
    ProductCategory["BOOKS"] = "books";
    ProductCategory["HOME"] = "home";
    ProductCategory["SPORTS"] = "sports";
    ProductCategory["FOOD"] = "food";
    ProductCategory["BEAUTY"] = "beauty";
    ProductCategory["AUTOMOTIVE"] = "automotive";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["ACTIVE"] = "active";
    ProductStatus["INACTIVE"] = "inactive";
    ProductStatus["DISCONTINUED"] = "discontinued";
    ProductStatus["OUT_OF_STOCK"] = "out_of_stock";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'iPhone 15 Pro',
        minLength: 3,
        maxLength: 100
    }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.Length)(3, 100, { message: 'Name must be between 3 and 100 characters' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product description',
        example: 'Latest iPhone with advanced features',
        minLength: 10,
        maxLength: 1000
    }),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.Length)(10, 1000, { message: 'Description must be between 10 and 1000 characters' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product price in USD',
        example: 999.99,
        minimum: 0.01
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Price must be a number' }),
    (0, class_validator_1.Min)(0.01, { message: 'Price must be greater than 0' }),
    (0, class_validator_1.Max)(999999.99, { message: 'Price cannot exceed 999,999.99' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product category',
        enum: ProductCategory,
        example: ProductCategory.ELECTRONICS
    }),
    (0, class_validator_1.IsEnum)(ProductCategory, { message: 'Category must be a valid product category' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product brand',
        example: 'Apple',
        minLength: 2,
        maxLength: 50
    }),
    (0, class_validator_1.IsString)({ message: 'Brand must be a string' }),
    (0, class_validator_1.Length)(2, 50, { message: 'Brand must be between 2 and 50 characters' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product SKU (Stock Keeping Unit)',
        example: 'IPH15PRO-256GB-BLACK',
        minLength: 5,
        maxLength: 50
    }),
    (0, class_validator_1.IsString)({ message: 'SKU must be a string' }),
    (0, class_validator_1.Length)(5, 50, { message: 'SKU must be between 5 and 50 characters' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product status',
        enum: ProductStatus,
        example: ProductStatus.ACTIVE
    }),
    (0, class_validator_1.IsEnum)(ProductStatus, { message: 'Status must be a valid product status' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product weight in grams',
        example: 187,
        minimum: 0.1
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Weight must be a number' }),
    (0, class_validator_1.Min)(0.1, { message: 'Weight must be at least 0.1 grams' }),
    (0, class_validator_1.Max)(100000, { message: 'Weight cannot exceed 100,000 grams' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "weightInGrams", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product images URLs',
        example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Images must be an array' }),
    (0, class_validator_1.ArrayMinSize)(0, { message: 'Images array cannot be empty' }),
    (0, class_validator_1.ArrayMaxSize)(10, { message: 'Cannot have more than 10 images' }),
    (0, class_validator_1.IsUrl)({}, { each: true, message: 'Each image must be a valid URL' }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product tags',
        example: ['smartphone', '5G', 'camera'],
        isArray: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Tags must be an array' }),
    (0, class_validator_1.ArrayMinSize)(0, { message: 'Tags array cannot be empty' }),
    (0, class_validator_1.ArrayMaxSize)(20, { message: 'Cannot have more than 20 tags' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each tag must be a string' }),
    (0, class_validator_1.Length)(1, 30, { each: true, message: 'Each tag must be between 1 and 30 characters' }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product specifications',
        example: { 'Storage': '256GB', 'Color': 'Black', 'Screen': '6.1 inch' }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Specifications must be an object' }),
    __metadata("design:type", Object)
], CreateProductDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the product is featured',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isFeatured must be a boolean' }),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product release date',
        example: '2024-01-15T00:00:00.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Release date must be a valid ISO date string' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "releaseDate", void 0);
//# sourceMappingURL=create-product.dto.js.map