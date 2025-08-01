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
    async getAllProducts() {
        try {
            console.log('🔍 Query Service: Making TCP call to get all products...');
            const result = await this.productServiceClient.send({ cmd: 'get_all_products' }, {}).toPromise();
            console.log('✅ Query Service: Successfully received products via TCP');
            return result;
        }
        catch (error) {
            console.error('❌ Query Service: Error fetching all products via TCP:', error);
            throw new Error(`Failed to fetch products from Product Service: ${error.message}`);
        }
    }
    async searchProducts(filters) {
        try {
            console.log('🔍 Query Service: Making TCP call to search products with filters:', filters);
            const result = await this.productServiceClient.send({ cmd: 'search_products' }, {
                category: filters.category,
                name: filters.name,
                startDate: filters.startDate,
                endDate: filters.endDate
            }).toPromise();
            console.log('✅ Query Service: Successfully received search results via TCP');
            return result;
        }
        catch (error) {
            console.error('❌ Query Service: Error searching products via TCP:', error);
            throw new Error(`Failed to search products from Product Service: ${error.message}`);
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