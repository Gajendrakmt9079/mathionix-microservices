import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../schemas/product.schema';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Product with this SKU already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateProductDto })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Product with this SKU already exists', HttpStatus.CONFLICT);
      }
      
      // Handle validation errors
      if (error.message && error.message.includes('validation failed')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      // Re-throw the error if it's already an HttpException
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Failed to create product',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(): Promise<Product[]> {
    try {
      return await this.productService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch products',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // TCP Message Handlers for microservice communication
  @MessagePattern({ cmd: 'get_all_products' })
  async getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @MessagePattern({ cmd: 'get_products_with_filters' })
  async getProductsWithFilters(@Payload() filters: {
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
    return this.productService.findAllWithFilters(filters);
  }

  @MessagePattern({ cmd: 'search_by_date_range' })
  async searchByDateRange(@Payload() data: { startDate: string; endDate: string }): Promise<Product[]> {
    return this.productService.searchByDateRange(data.startDate, data.endDate);
  }

  @MessagePattern({ cmd: 'search_by_text' })
  async searchByText(@Payload() data: { searchTerm: string }): Promise<Product[]> {
    return this.productService.searchByText(data.searchTerm);
  }

  @MessagePattern({ cmd: 'create_product' })
  async createProduct(@Payload() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }
} 