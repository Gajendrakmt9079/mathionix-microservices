# Mathiox Microservices

A NestJS microservices project with two services:
1. **Product Service** - Handles product data with comprehensive validation
2. **Product Query Service** - Handles data retrieval with filters and search via TCP communication

## Architecture

```
┌─────────────────┐    TCP     ┌──────────────────┐
│ Product Query   │ ──────────► │ Product Service  │
│ Service (3003)  │             │ (3001 HTTP,      │
│                 │             │  3002 TCP)       │
└─────────────────┘             └──────────────────┘
```

## Features

### Product Service
- **Schema Validation**: 8+ fields with comprehensive validation
- **REST API**: Full CRUD operations
- **TCP Microservice**: Internal communication
- **Swagger Documentation**: Auto-generated API docs

### Product Query Service
- **Data Retrieval**: Get all products with filters
- **Date Filters**: Filter by creation date range
- **Search Functionality**: Search across multiple fields
- **TCP Communication**: Fetches data from Product Service
- **Pagination**: Built-in pagination support

## Product Schema Fields

1. **name** (string, 3-100 chars) - Product name
2. **description** (string, 10-1000 chars) - Product description
3. **price** (number, 0.01-999999.99) - Product price in USD
4. **category** (enum) - Product category (electronics, clothing, books, etc.)
5. **brand** (string, 2-50 chars) - Product brand
6. **sku** (string, 5-50 chars) - Stock Keeping Unit
7. **status** (enum) - Product status (active, inactive, discontinued, out_of_stock)
8. **weightInGrams** (number, 0.1-100000) - Product weight
9. **images** (optional array) - Product image URLs
10. **tags** (optional array) - Product tags
11. **specifications** (optional object) - Product specifications
12. **isFeatured** (optional boolean) - Featured product flag
13. **releaseDate** (optional date) - Product release date

## Installation

1. **Install dependencies for both services:**
```bash
npm install
cd product-service && npm install
cd ../product-query-service && npm install
cd ..
```

2. **Build both services:**
```bash
npm run build
```

## Running the Services

### Option 1: Run from root (recommended)
```bash
# Terminal 1 - Start Product Service
npm run dev:product

# Terminal 2 - Start Product Query Service
npm run dev:query
```

### Option 2: Run individually
```bash
# Product Service
cd product-service
npm run start:dev

# Product Query Service (in another terminal)
cd product-query-service
npm run start:dev
```

## Service Ports

- **Product Service HTTP**: http://localhost:3001
- **Product Service TCP**: localhost:3002
- **Product Query Service**: http://localhost:3003

## API Documentation

### Product Service (Port 3001)
- **Swagger UI**: http://localhost:3001/api
- **Base URL**: http://localhost:3001/products

#### Endpoints:
- `POST /products` - Create a new product
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Product Query Service (Port 3003)
- **Swagger UI**: http://localhost:3003/api
- **Base URL**: http://localhost:3003/product-query

#### Endpoints:
- `GET /product-query` - Get all products with filters and pagination
- `GET /product-query/all` - Get all products without pagination
- `GET /product-query/search?q=term` - Search products
- `GET /product-query/featured` - Get featured products
- `GET /product-query/category/:category` - Get products by category
- `GET /product-query/brand/:brand` - Get products by brand
- `GET /product-query/price-range?minPrice=100&maxPrice=1000` - Get products by price range
- `GET /product-query/date-range?startDate=2024-01-01&endDate=2024-12-31` - Get products by date range
- `GET /product-query/:id` - Get product by ID

## Query Parameters

The Product Query Service supports various filter parameters:

- `category` - Filter by product category
- `brand` - Filter by product brand
- `status` - Filter by product status
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `isFeatured` - Filter featured products
- `search` - Search term for name, description, brand, SKU, or tags
- `startDate` - Start date filter (ISO string)
- `endDate` - End date filter (ISO string)
- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 10, max: 100)

## Example Usage

### Create a Product
```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with advanced features",
    "price": 999.99,
    "category": "electronics",
    "brand": "Apple",
    "sku": "IPH15PRO-256GB-BLACK",
    "status": "active",
    "weightInGrams": 187,
    "images": ["https://example.com/image1.jpg"],
    "tags": ["smartphone", "5G", "camera"],
    "specifications": {"Storage": "256GB", "Color": "Black"},
    "isFeatured": true,
    "releaseDate": "2024-01-15T00:00:00.000Z"
  }'
```

### Search Products
```bash
curl "http://localhost:3003/product-query/search?q=iPhone"
```

### Get Products with Filters
```bash
curl "http://localhost:3003/product-query?category=electronics&minPrice=500&maxPrice=1500&page=1&limit=10"
```

### Get Products by Date Range
```bash
curl "http://localhost:3003/product-query/date-range?startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T23:59:59.999Z"
```

## TCP Communication

The services communicate via TCP on port 3002. The Product Query Service sends messages to the Product Service using these commands:

- `get_all_products` - Get all products
- `get_product_by_id` - Get product by ID
- `get_products_by_filters` - Get products with filters
- `create_product` - Create a new product
- `update_product` - Update a product
- `delete_product` - Delete a product

## Development

### Project Structure
```
mathiox/
├── package.json                 # Root package.json with workspaces
├── product-service/             # First microservice
│   ├── src/
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entities/           # Product entity
│   │   ├── services/           # Business logic
│   │   ├── controllers/        # HTTP and TCP handlers
│   │   ├── app.module.ts       # Main module
│   │   └── main.ts            # Application entry point
│   └── package.json
└── product-query-service/       # Second microservice
    ├── src/
    │   ├── dto/                # Query filter DTOs
    │   ├── interfaces/         # TypeScript interfaces
    │   ├── services/           # Query business logic
    │   ├── controllers/        # HTTP controllers
    │   ├── app.module.ts       # Main module
    │   └── main.ts            # Application entry point
    └── package.json
```

### Adding New Features

1. **Add new fields to Product schema**: Update `CreateProductDto` in product-service
2. **Add new filters**: Update `QueryFiltersDto` in product-query-service
3. **Add new endpoints**: Add methods to controllers
4. **Add new TCP commands**: Add message patterns to ProductController

## Testing

```bash
# Test Product Service
cd product-service
npm run test

# Test Product Query Service
cd product-query-service
npm run test
```

## Production

```bash
# Build for production
npm run build

# Start production servers
npm run start:product
npm run start:query
```

## Troubleshooting

1. **Port conflicts**: Ensure ports 3001, 3002, and 3003 are available
2. **TCP connection issues**: Make sure Product Service is running before Product Query Service
3. **Validation errors**: Check the request body matches the DTO schema
4. **Dependencies**: Run `npm install` in both service directories

## License

This project is for educational purposes. 