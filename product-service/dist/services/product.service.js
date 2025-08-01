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
    async findAllWithFilters(filters) {
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
            if (filters.startDate || filters.endDate) {
                query.releaseDate = {};
                if (filters.startDate) {
                    query.releaseDate.$gte = new Date(filters.startDate);
                }
                if (filters.endDate) {
                    query.releaseDate.$lte = new Date(filters.endDate);
                }
            }
            const page = filters.page || 1;
            const limit = filters.limit || 10;
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
            throw new common_1.BadRequestException('Failed to fetch products with filters: ' + error.message);
        }
    }
    async searchByDateRange(startDate, endDate) {
        try {
            if (!startDate || !endDate) {
                throw new common_1.BadRequestException('Both start date and end date are required');
            }
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new common_1.BadRequestException('Invalid date format');
            }
            if (start > end) {
                throw new common_1.BadRequestException('Start date must be before end date');
            }
            return await this.productModel.find({
                $or: [
                    { createdAt: { $gte: start, $lte: end } },
                    { releaseDate: { $gte: start, $lte: end } }
                ]
            }).exec();
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to search by date range: ' + error.message);
        }
    }
    async searchByText(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim().length === 0) {
                throw new common_1.BadRequestException('Search term is required');
            }
            return await this.productModel.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { brand: { $regex: searchTerm, $options: 'i' } },
                    { sku: { $regex: searchTerm, $options: 'i' } },
                    { tags: { $in: [new RegExp(searchTerm, 'i')] } }
                ]
            }).exec();
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