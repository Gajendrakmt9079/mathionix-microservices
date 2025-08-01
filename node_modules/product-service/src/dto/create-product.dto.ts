import { IsString, IsNumber, IsBoolean, IsDateString, IsOptional, Min, Max, IsUrl, IsArray, ArrayMinSize, ArrayMaxSize, Length, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home',
  SPORTS = 'sports',
  FOOD = 'food',
  BEAUTY = 'beauty',
  AUTOMOTIVE = 'automotive'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
  OUT_OF_STOCK = 'out_of_stock'
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
    minLength: 3,
    maxLength: 100
  })
  @IsString({ message: 'Name must be a string' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with advanced features',
    minLength: 10,
    maxLength: 1000
  })
  @IsString({ message: 'Description must be a string' })
  @Length(10, 1000, { message: 'Description must be between 10 and 1000 characters' })
  description: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 999.99,
    minimum: 0.01
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  @Max(999999.99, { message: 'Price cannot exceed 999,999.99' })
  price: number;

  @ApiProperty({
    description: 'Product category',
    enum: ProductCategory,
    example: ProductCategory.ELECTRONICS
  })
  @IsEnum(ProductCategory, { message: 'Category must be a valid product category' })
  category: ProductCategory;

  @ApiProperty({
    description: 'Product brand',
    example: 'Apple',
    minLength: 2,
    maxLength: 50
  })
  @IsString({ message: 'Brand must be a string' })
  @Length(2, 50, { message: 'Brand must be between 2 and 50 characters' })
  brand: string;

  @ApiProperty({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'IPH15PRO-256GB-BLACK',
    minLength: 5,
    maxLength: 50
  })
  @IsString({ message: 'SKU must be a string' })
  @Length(5, 50, { message: 'SKU must be between 5 and 50 characters' })
  sku: string;

  @ApiProperty({
    description: 'Product status',
    enum: ProductStatus,
    example: ProductStatus.ACTIVE
  })
  @IsEnum(ProductStatus, { message: 'Status must be a valid product status' })
  status: ProductStatus;

  @ApiProperty({
    description: 'Product weight in grams',
    example: 187,
    minimum: 0.1
  })
  @IsNumber({}, { message: 'Weight must be a number' })
  @Min(0.1, { message: 'Weight must be at least 0.1 grams' })
  @Max(100000, { message: 'Weight cannot exceed 100,000 grams' })
  weightInGrams: number;

  @ApiPropertyOptional({
    description: 'Product images URLs',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    isArray: true
  })
  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  @ArrayMinSize(0, { message: 'Images array cannot be empty' })
  @ArrayMaxSize(10, { message: 'Cannot have more than 10 images' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Product tags',
    example: ['smartphone', '5G', 'camera'],
    isArray: true
  })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @ArrayMinSize(0, { message: 'Tags array cannot be empty' })
  @ArrayMaxSize(20, { message: 'Cannot have more than 20 tags' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @Length(1, 30, { each: true, message: 'Each tag must be between 1 and 30 characters' })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Product specifications',
    example: { 'Storage': '256GB', 'Color': 'Black', 'Screen': '6.1 inch' }
  })
  @IsOptional()
  @IsObject({ message: 'Specifications must be an object' })
  specifications?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Whether the product is featured',
    example: false
  })
  @IsOptional()
  @IsBoolean({ message: 'isFeatured must be a boolean' })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Product release date',
    example: '2024-01-15T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Release date must be a valid ISO date string' })
  releaseDate?: string;
} 