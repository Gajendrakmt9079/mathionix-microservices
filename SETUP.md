# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install dependencies for both services:**
```bash
cd product-service && npm install && cd ..
cd product-query-service && npm install && cd ..
```

## Running the Services

### Option 1: Start both services at once (Recommended)
```bash
npm run start:all
```

### Option 2: Start services individually
```bash
# Terminal 1 - Product Service
npm run dev:product

# Terminal 2 - Product Query Service  
npm run dev:query
```

## Testing the APIs

Once both services are running, test the functionality:

```bash
npm run test:api
```

## Service URLs

- **Product Service**: http://localhost:3001
  - API Docs: http://localhost:3001/api
  - TCP Port: 3002

- **Product Query Service**: http://localhost:3003
  - API Docs: http://localhost:3003/api

## Quick Test Commands

### Create a product:
```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "A test product for demonstration",
    "price": 99.99,
    "category": "electronics",
    "brand": "TestBrand",
    "sku": "TEST-001",
    "status": "active",
    "weightInGrams": 100
  }'
```

### Search products:
```bash
curl "http://localhost:3003/product-query/search?q=Test"
```

### Get products with filters:
```bash
curl "http://localhost:3003/product-query?category=electronics&minPrice=50&maxPrice=200"
```

## Architecture Overview

```
┌─────────────────┐    TCP     ┌──────────────────┐
│ Product Query   │ ──────────► │ Product Service  │
│ Service (3003)  │             │ (3001 HTTP,      │
│                 │             │  3002 TCP)       │
└─────────────────┘             └──────────────────┘
```

- **Product Service**: Handles CRUD operations and data storage
- **Product Query Service**: Handles data retrieval with filters and search via TCP communication

## Features Implemented

✅ **Product Service:**
- Schema with 8+ fields and comprehensive validation
- REST API with full CRUD operations
- TCP microservice for internal communication
- Swagger documentation

✅ **Product Query Service:**
- Data retrieval with date filters
- Search functionality across multiple fields
- TCP communication with Product Service
- Pagination support
- Multiple filter options (category, brand, price range, etc.)

## Troubleshooting

1. **Port conflicts**: Ensure ports 3001, 3002, and 3003 are available
2. **TCP connection issues**: Start Product Service before Product Query Service
3. **Dependencies**: Run `npm install` in both service directories if you encounter module errors 