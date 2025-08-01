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
exports.ProductQueryService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let ProductQueryService = class ProductQueryService {
    constructor(productServiceClient) {
        this.productServiceClient = productServiceClient;
    }
    async getAllProducts(page = 1, limit = 10) {
        try {
            const products = await this.productServiceClient.send({ cmd: 'get_all_products' }, {}).toPromise();
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedProducts = products.slice(startIndex, endIndex);
            const total = products.length;
            const totalPages = Math.ceil(total / limit);
            return {
                data: paginatedProducts,
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            };
        }
        catch (error) {
            console.error('Error fetching all products via TCP:', error);
            throw new Error('Failed to fetch products from Product Service');
        }
    }
    async searchProducts(filters) {
        try {
            const result = await this.productServiceClient.send({ cmd: 'get_products_with_filters' }, {
                search: filters.search,
                startDate: filters.startDate,
                endDate: filters.endDate,
                category: filters.category,
                brand: filters.brand,
                status: filters.status,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                isFeatured: filters.isFeatured,
                page: filters.page || 1,
                limit: filters.limit || 10
            }).toPromise();
            return result;
        }
        catch (error) {
            console.error('Error searching products via TCP:', error);
            throw new Error('Failed to search products from Product Service');
        }
    }
    async searchByDateRange(startDate, endDate) {
        try {
            return await this.productServiceClient.send({ cmd: 'search_by_date_range' }, {
                startDate,
                endDate
            }).toPromise();
        }
        catch (error) {
            console.error('Error searching by date range via TCP:', error);
            throw new Error('Failed to search by date range from Product Service');
        }
    }
    async searchByText(searchTerm) {
        try {
            return await this.productServiceClient.send({ cmd: 'search_by_text' }, {
                searchTerm
            }).toPromise();
        }
        catch (error) {
            console.error('Error searching by text via TCP:', error);
            throw new Error('Failed to search by text from Product Service');
        }
    }
};
exports.ProductQueryService = ProductQueryService;
exports.ProductQueryService = ProductQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRODUCT_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], ProductQueryService);
//# sourceMappingURL=product-query.service.js.map