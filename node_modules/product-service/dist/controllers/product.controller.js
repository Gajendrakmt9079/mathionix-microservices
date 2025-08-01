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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("../services/product.service");
const create_product_dto_1 = require("../dto/create-product.dto");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async create(createProductDto) {
        try {
            return await this.productService.create(createProductDto);
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.HttpException('Product with this SKU already exists', common_1.HttpStatus.CONFLICT);
            }
            if (error.message && error.message.includes('validation failed')) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to create product', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            return await this.productService.findAll();
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to fetch products', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchByFilters(category, name, startDate, endDate) {
        try {
            return await this.productService.searchByFilters({
                category,
                name,
                startDate,
                endDate
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to search products', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllProducts() {
        console.log('🔍 Product Service: Received TCP request for get_all_products');
        try {
            const result = await this.productService.findAll();
            console.log(`✅ Product Service: Returning ${result.length} products via TCP`);
            return result;
        }
        catch (error) {
            console.error('❌ Product Service: Error in get_all_products TCP handler:', error);
            throw error;
        }
    }
    async searchProducts(filters) {
        console.log('🔍 Product Service: Received TCP request for search_products with filters:', filters);
        try {
            const result = await this.productService.searchByFilters(filters);
            console.log(`✅ Product Service: Returning ${result.length} products via TCP search`);
            return result;
        }
        catch (error) {
            console.error('❌ Product Service: Error in search_products TCP handler:', error);
            throw error;
        }
    }
    async createProduct(createProductDto) {
        console.log('🔍 Product Service: Received TCP request for create_product');
        try {
            const result = await this.productService.create(createProductDto);
            console.log('✅ Product Service: Product created successfully via TCP');
            return result;
        }
        catch (error) {
            console.error('❌ Product Service: Error in create_product TCP handler:', error);
            throw error;
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Product with this SKU already exists' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    (0, swagger_1.ApiBody)({ type: create_product_dto_1.CreateProductDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all products' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search products by category, name, and date range' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products found successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Product category' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: false, description: 'Search by product name, description, or brand' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date (ISO string)' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchByFilters", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get_all_products' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'search_products' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchProducts", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'create_product' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map