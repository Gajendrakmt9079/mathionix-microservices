import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { ProductQueryService } from "../services/product-query.service";
import { QueryFiltersDto } from "../dto/query-filters.dto";
import { Product } from "../interfaces/product.interface";

@ApiTags("product-query")
@Controller("product-query")
export class ProductQueryController {
  constructor(private readonly productQueryService: ProductQueryService) {}

  @Get()
  @ApiOperation({ summary: "Get all products (TCP call to Product Service)" })
  @ApiResponse({ status: 200, description: "Products retrieved successfully" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productQueryService.getAllProducts();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to fetch products",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("search")
  @ApiOperation({ summary: "Search products by category, name, and date range (TCP call to Product Service)" })
  @ApiResponse({ status: 200, description: "Products found successfully" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @ApiQuery({
    name: "category",
    description: "Product category",
    example: "electronics",
    required: false,
  })
  @ApiQuery({
    name: "name",
    description: "Search by product name, description, or brand",
    example: "iPhone",
    required: false,
  })
  @ApiQuery({
    name: "startDate",
    description: "Start date (ISO string)",
    example: "2024-01-01T00:00:00.000Z",
    required: false,
  })
  @ApiQuery({
    name: "endDate",
    description: "End date (ISO string)",
    example: "2024-12-31T23:59:59.999Z",
    required: false,
  })
  async searchProducts(@Query() filters: QueryFiltersDto): Promise<Product[]> {
    try {
      return await this.productQueryService.searchProducts(filters);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to search products",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
