import { Controller, Get, Post, Body, HttpException, HttpStatus, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
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

  @Get('search')
  @ApiOperation({ summary: 'Search products by category, name, and date range' })
  @ApiResponse({ status: 200, description: 'Products found successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({ name: 'category', required: false, description: 'Product category' })
  @ApiQuery({ name: 'name', required: false, description: 'Search by product name, description, or brand' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  async searchByFilters(
    @Query('category') category?: string,
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<Product[]> {
    try {
      return await this.productService.searchByFilters({
        category,
        name,
        startDate,
        endDate
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to search products',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // TCP Message Handlers for microservice communication
  @MessagePattern({ cmd: 'get_all_products' })
  async getAllProducts(): Promise<Product[]> {
    console.log('🔍 Product Service: Received TCP request for get_all_products');
    try {
      const result = await this.productService.findAll();
      console.log(`✅ Product Service: Returning ${result.length} products via TCP`);
      return result;
    } catch (error) {
      console.error('❌ Product Service: Error in get_all_products TCP handler:', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'search_products' })
  async searchProducts(@Payload() filters: {
    category?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Product[]> {
    console.log('🔍 Product Service: Received TCP request for search_products with filters:', filters);
    try {
      const result = await this.productService.searchByFilters(filters);
      console.log(`✅ Product Service: Returning ${result.length} products via TCP search`);
      return result;
    } catch (error) {
      console.error('❌ Product Service: Error in search_products TCP handler:', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'create_product' })
  async createProduct(@Payload() createProductDto: CreateProductDto): Promise<Product> {
    console.log('🔍 Product Service: Received TCP request for create_product');
    try {
      const result = await this.productService.create(createProductDto);
      console.log('✅ Product Service: Product created successfully via TCP');
      return result;
    } catch (error) {
      console.error('❌ Product Service: Error in create_product TCP handler:', error);
      throw error;
    }
  }
}