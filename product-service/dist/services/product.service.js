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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../schemas/product.schema");
let ProductService = class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(createProductDto) {
        try {
            const existingProduct = await this.productModel.findOne({ sku: createProductDto.sku }).exec();
            if (existingProduct) {
                throw new common_1.ConflictException(`Product with SKU '${createProductDto.sku}' already exists`);
            }
            if (!Number.isFinite(createProductDto.price) || createProductDto.price <= 0) {
                throw new common_1.BadRequestException('Price must be a positive number');
            }
            if (!Number.isFinite(createProductDto.weightInGrams) || createProductDto.weightInGrams <= 0) {
                throw new common_1.BadRequestException('Weight must be a positive number');
            }
            if (createProductDto.releaseDate) {
                const releaseDate = new Date(createProductDto.releaseDate);
                if (isNaN(releaseDate.getTime())) {
                    throw new common_1.BadRequestException('Invalid release date format');
                }
                const now = new Date();
                if (releaseDate > now) {
                    throw new common_1.BadRequestException('Release date cannot be in the future');
                }
            }
            if (createProductDto.images && createProductDto.images.length > 0) {
                for (const imageUrl of createProductDto.images) {
                    try {
                        new URL(imageUrl);
                    }
                    catch {
                        throw new common_1.BadRequestException(`Invalid image URL: ${imageUrl}`);
                    }
                }
            }
            if (createProductDto.specifications) {
                for (const [key, value] of Object.entries(createProductDto.specifications)) {
                    if (!key || key.trim().length === 0) {
                        throw new common_1.BadRequestException('Specification key cannot be empty');
                    }
                    if (!value || value.trim().length === 0) {
                        throw new common_1.BadRequestException(`Specification value for '${key}' cannot be empty`);
                    }
                    if (key.length > 50) {
                        throw new common_1.BadRequestException(`Specification key '${key}' is too long (max 50 characters)`);
                    }
                    if (value.length > 200) {
                        throw new common_1.BadRequestException(`Specification value for '${key}' is too long (max 200 characters)`);
                    }
                }
            }
            if (createProductDto.tags && createProductDto.tags.length > 0) {
                const uniqueTags = new Set(createProductDto.tags.map(tag => tag.toLowerCase()));
                if (uniqueTags.size !== createProductDto.tags.length) {
                    throw new common_1.BadRequestException('Tags must be unique (case-insensitive)');
                }
            }
            const productData = {
                ...createProductDto,
                createdBy: 'system',
                updatedBy: 'system'
            };
            if (createProductDto.releaseDate) {
                productData.releaseDate = new Date(createProductDto.releaseDate);
            }
            const createdProduct = new this.productModel(productData);
            return createdProduct.save();
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create product: ' + error.message);
        }
    }
    async findAll() {
        try {
            return await this.productModel.find().exec();
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch products: ' + error.message);
        }
    }
    async searchByFilters(filters) {
        try {
            const query = {};
            if (filters.category) {
                query.category = filters.category;
            }
            if (filters.name) {
                query.$or = [
                    { name: { $regex: filters.name, $options: 'i' } },
                    { description: { $regex: filters.name, $options: 'i' } },
                    { brand: { $regex: filters.name, $options: 'i' } }
                ];
            }
            if (filters.startDate || filters.endDate) {
                query.$and = [];
                if (filters.startDate) {
                    query.$and.push({
                        $or: [
                            { createdAt: { $gte: new Date(filters.startDate) } },
                            { releaseDate: { $gte: new Date(filters.startDate) } }
                        ]
                    });
                }
                if (filters.endDate) {
                    query.$and.push({
                        $or: [
                            { createdAt: { $lte: new Date(filters.endDate) } },
                            { releaseDate: { $lte: new Date(filters.endDate) } }
                        ]
                    });
                }
            }
            return await this.productModel.find(query).exec();
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to search products: ' + error.message);
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductService);
//# sourceMappingURL=product.service.js.map