import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Validate SKU uniqueness
      const existingProduct = await this.productModel.findOne({ sku: createProductDto.sku }).exec();
      if (existingProduct) {
        throw new ConflictException(`Product with SKU '${createProductDto.sku}' already exists`);
      }

      // Validate price format (ensure it's a valid number with up to 2 decimal places)
      if (!Number.isFinite(createProductDto.price) || createProductDto.price <= 0) {
        throw new BadRequestException('Price must be a positive number');
      }

      // Validate weight format
      if (!Number.isFinite(createProductDto.weightInGrams) || createProductDto.weightInGrams <= 0) {
        throw new BadRequestException('Weight must be a positive number');
      }

      // Validate release date if provided
      if (createProductDto.releaseDate) {
        const releaseDate = new Date(createProductDto.releaseDate);
        if (isNaN(releaseDate.getTime())) {
          throw new BadRequestException('Invalid release date format');
        }
        
        // Check if release date is not in the future (optional business rule)
        const now = new Date();
        if (releaseDate > now) {
          throw new BadRequestException('Release date cannot be in the future');
        }
      }

      // Validate images URLs if provided
      if (createProductDto.images && createProductDto.images.length > 0) {
        for (const imageUrl of createProductDto.images) {
          try {
            new URL(imageUrl);
          } catch {
            throw new BadRequestException(`Invalid image URL: ${imageUrl}`);
          }
        }
      }

      // Validate specifications if provided
      if (createProductDto.specifications) {
        for (const [key, value] of Object.entries(createProductDto.specifications)) {
          if (!key || key.trim().length === 0) {
            throw new BadRequestException('Specification key cannot be empty');
          }
          if (!value || value.trim().length === 0) {
            throw new BadRequestException(`Specification value for '${key}' cannot be empty`);
          }
          if (key.length > 50) {
            throw new BadRequestException(`Specification key '${key}' is too long (max 50 characters)`);
          }
          if (value.length > 200) {
            throw new BadRequestException(`Specification value for '${key}' is too long (max 200 characters)`);
          }
        }
      }

      // Validate tags if provided
      if (createProductDto.tags && createProductDto.tags.length > 0) {
        const uniqueTags = new Set(createProductDto.tags.map(tag => tag.toLowerCase()));
        if (uniqueTags.size !== createProductDto.tags.length) {
          throw new BadRequestException('Tags must be unique (case-insensitive)');
        }
      }

      const productData: any = {
        ...createProductDto,
        createdBy: 'system',
        updatedBy: 'system'
      };
      
      // Convert releaseDate string to Date if provided
      if (createProductDto.releaseDate) {
        productData.releaseDate = new Date(createProductDto.releaseDate);
      }
      
      const createdProduct = new this.productModel(productData);
      return createdProduct.save();
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create product: ' + error.message);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Failed to fetch products: ' + error.message);
    }
  }

  // TCP Methods for microservice communication
  async findAllWithFilters(filters: {
    search?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    brand?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    try {
      const query: any = {};

      // Search by product name, description, brand, SKU, or tags
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { brand: { $regex: filters.search, $options: 'i' } },
          { sku: { $regex: filters.search, $options: 'i' } },
          { tags: { $in: [new RegExp(filters.search, 'i')] } }
        ];
      }

      // Filter by category
      if (filters.category) {
        query.category = filters.category;
      }

      // Filter by brand
      if (filters.brand) {
        query.brand = { $regex: filters.brand, $options: 'i' };
      }

      // Filter by status
      if (filters.status) {
        query.status = filters.status;
      }

      // Filter by price range
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) {
          query.price.$gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          query.price.$lte = filters.maxPrice;
        }
      }

      // Filter by featured status
      if (filters.isFeatured !== undefined) {
        query.isFeatured = filters.isFeatured;
      }

      // Filter by date range (createdAt)
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      // Filter by release date range
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
    } catch (error) {
      throw new BadRequestException('Failed to fetch products with filters: ' + error.message);
    }
  }

  async searchByDateRange(startDate: string, endDate: string): Promise<Product[]> {
    try {
      if (!startDate || !endDate) {
        throw new BadRequestException('Both start date and end date are required');
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      if (start > end) {
        throw new BadRequestException('Start date must be before end date');
      }

      return await this.productModel.find({
        $or: [
          { createdAt: { $gte: start, $lte: end } },
          { releaseDate: { $gte: start, $lte: end } }
        ]
      }).exec();
    } catch (error) {
      throw new BadRequestException('Failed to search by date range: ' + error.message);
    }
  }

  async searchByText(searchTerm: string): Promise<Product[]> {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        throw new BadRequestException('Search term is required');
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
    } catch (error) {
      throw new BadRequestException('Failed to search products: ' + error.message);
    }
  }
} 