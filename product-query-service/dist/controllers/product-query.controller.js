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
exports.ProductQueryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_query_service_1 = require("../services/product-query.service");
const query_filters_dto_1 = require("../dto/query-filters.dto");
let ProductQueryController = class ProductQueryController {
    constructor(productQueryService) {
        this.productQueryService = productQueryService;
    }
    async getAllProducts(page = "1", limit = "10") {
        try {
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                throw new common_1.HttpException("Invalid pagination parameters", common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.productQueryService.getAllProducts(pageNum, limitNum);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || "Failed to fetch products", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchProducts(filters) {
        try {
            return await this.productQueryService.searchProducts(filters);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || "Failed to search products", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ProductQueryController = ProductQueryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all products with pagination" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Products retrieved successfully" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Internal server error" }),
    (0, swagger_1.ApiQuery)({
        name: "page",
        description: "Page number",
        example: 1,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        description: "Items per page",
        example: 10,
        required: false,
    }),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductQueryController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)("search"),
    (0, swagger_1.ApiOperation)({ summary: "Search products with comprehensive filters" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Products found successfully" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Internal server error" }),
    (0, swagger_1.ApiQuery)({
        name: "search",
        description: "Search term (name, description, brand, SKU, tags)",
        example: "iPhone",
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "category",
        description: "Product category",
        enum: [
            "electronics",
            "clothing",
            "books",
            "home",
            "sports",
            "food",
            "beauty",
            "automotive",
        ],
        example: "electronics",
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "brand",
        description: "Product brand",
        example: "Apple",
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "status",
        description: "Product status",
        enum: ["active", "inactive", "discontinued", "out_of_stock"],
        example: "active",
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "minPrice",
        description: "Minimum price",
        example: 100,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "maxPrice",
        description: "Maximum price",
        example: 1000,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "isFeatured",
        description: "Featured products only",
        example: true,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "startDate",
        description: "Start date (ISO string)",
        example: "2024-01-01T00:00:00.000Z",
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "endDate",
        description: "End date (ISO string)",
        example: "2024-12-31T23:59:59.999Z",
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "page",
        description: "Page number",
        example: 1,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        description: "Items per page",
        example: 10,
        required: false,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_filters_dto_1.QueryFiltersDto]),
    __metadata("design:returntype", Promise)
], ProductQueryController.prototype, "searchProducts", null);
exports.ProductQueryController = ProductQueryController = __decorate([
    (0, swagger_1.ApiTags)("product-query"),
    (0, common_1.Controller)("product-query"),
    __metadata("design:paramtypes", [product_query_service_1.ProductQueryService])
], ProductQueryController);
//# sourceMappingURL=product-query.controller.js.map