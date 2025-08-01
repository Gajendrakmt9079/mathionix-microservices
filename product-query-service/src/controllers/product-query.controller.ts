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
import { PaginatedProductsResponse } from "../interfaces/product.interface";

@ApiTags("product-query")
@Controller("product-query")
export class ProductQueryController {
  constructor(private readonly productQueryService: ProductQueryService) {}

  @Get()
  @ApiOperation({ summary: "Get all products with pagination" })
  @ApiResponse({ status: 200, description: "Products retrieved successfully" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @ApiQuery({
    name: "page",
    description: "Page number",
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: "limit",
    description: "Items per page",
    example: 10,
    required: false,
  })
  async getAllProducts(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ): Promise<PaginatedProductsResponse> {
    try {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;

      if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
        throw new HttpException(
          "Invalid pagination parameters",
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.productQueryService.getAllProducts(pageNum, limitNum);
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
  @ApiOperation({ summary: "Search products with comprehensive filters" })
  @ApiResponse({ status: 200, description: "Products found successfully" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @ApiQuery({
    name: "search",
    description: "Search term (name, description, brand, SKU, tags)",
    example: "iPhone",
    required: false,
  })
  @ApiQuery({
    name: "category",
    description: "Product category",
    enum: [
      "electronics",
      "clothing",
      "books",
      "home",
      "sports",
      "food",
      "beauty",
      "automotive",
    ],
    example: "electronics",
    required: false,
  })
  @ApiQuery({
    name: "brand",
    description: "Product brand",
    example: "Apple",
    required: false,
  })
  @ApiQuery({
    name: "status",
    description: "Product status",
    enum: ["active", "inactive", "discontinued", "out_of_stock"],
    example: "active",
    required: false,
  })
  @ApiQuery({
    name: "minPrice",
    description: "Minimum price",
    example: 100,
    required: false,
  })
  @ApiQuery({
    name: "maxPrice",
    description: "Maximum price",
    example: 1000,
    required: false,
  })
  @ApiQuery({
    name: "isFeatured",
    description: "Featured products only",
    example: true,
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
  @ApiQuery({
    name: "page",
    description: "Page number",
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: "limit",
    description: "Items per page",
    example: 10,
    required: false,
  })
  async searchProducts(
    @Query() filters: QueryFiltersDto
  ): Promise<PaginatedProductsResponse> {
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

  @Get("date-range")
  @ApiOperation({ summary: "Search products by date range (TCP call to Product Service)" })
  @ApiResponse({ status: 200, description: "Products found successfully" })
  @ApiResponse({ status: 400, description: "Date parameters are required" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @ApiQuery({
    name: "startDate",
    description: "Start date (ISO string)",
    example: "2024-01-01T00:00:00.000Z",
    required: true,
  })
  @ApiQuery({
    name: "endDate",
    description: "End date (ISO string)",
    example: "2024-12-31T23:59:59.999Z",
    required: true,
  })
  async searchByDateRange(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    try {
      if (!startDate || !endDate) {
        throw new HttpException(
          "Both startDate and endDate are required",
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.productQueryService.searchByDateRange(startDate, endDate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to search by date range",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("text-search")
  @ApiOperation({ summary: "Search products by text (TCP call to Product Service)" })
  @ApiResponse({ status: 200, description: "Products found successfully" })
  @ApiResponse({ status: 400, description: "Search term is required" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @ApiQuery({
    name: "q",
    description: "Search term",
    example: "iPhone",
    required: true,
  })
  async searchByText(@Query("q") searchTerm: string) {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        throw new HttpException(
          "Search term is required",
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.productQueryService.searchByText(searchTerm);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to search by text",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
