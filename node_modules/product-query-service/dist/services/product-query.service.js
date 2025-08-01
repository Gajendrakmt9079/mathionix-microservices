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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../schemas/product.schema");
let ProductQueryService = class ProductQueryService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async getAllProducts(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [products, total] = await Promise.all([
                this.productModel.find().skip(skip).limit(limit).exec(),
                this.productModel.countDocuments().exec()
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                data: products,
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            };
        }
        catch (error) {
            console.error('Error fetching all products:', error);
            throw new Error('Failed to fetch products from database');
        }
    }
    async searchProducts(filters) {
        try {
            const query = {};
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { brand: { $regex: filters.search, $options: 'i' } },
                    { sku: { $regex: filters.search, $options: 'i' } },
                    { tags: { $in: [new RegExp(filters.search, 'i')] } }
                ];
            }
            if (filters.category) {
                query.category = filters.category;
            }
            if (filters.brand) {
                query.brand = { $regex: filters.brand, $options: 'i' };
            }
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                query.price = {};
                if (filters.minPrice !== undefined) {
                    query.price.$gte = filters.minPrice;
                }
                if (filters.maxPrice !== undefined) {
                    query.price.$lte = filters.maxPrice;
                }
            }
            if (filters.isFeatured !== undefined) {
                query.isFeatured = filters.isFeatured;
            }
            if (filters.startDate || filters.endDate) {
                query.createdAt = {};
                if (filters.startDate) {
                    query.createdAt.$gte = new Date(filters.startDate);
                }
                if (filters.endDate) {
                    query.createdAt.$lte = new Date(filters.endDate);
                }
            }
            const { page = 1, limit = 10 } = filters;
            const skip = (page - 1) * limit;
            const [products, total] = await Promise.all([
                this.productModel.find(query).skip(skip).limit(limit).exec(),
                this.productModel.countDocuments(query).exec()
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                data: products,
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            };
        }
        catch (error) {
            console.error('Error searching products:', error);
            throw new Error('Failed to search products from database');
        }
    }
};
exports.ProductQueryService = ProductQueryService;
exports.ProductQueryService = ProductQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductQueryService);
//# sourceMappingURL=product-query.service.js.map