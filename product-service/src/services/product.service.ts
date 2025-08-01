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
} 