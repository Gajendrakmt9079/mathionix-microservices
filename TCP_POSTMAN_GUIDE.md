# 🔌 **TCP Microservice Communication - Complete Postman Guide**

## 📋 **Architecture Overview**

```
┌─────────────────┐    HTTP     ┌─────────────────┐
│   Client        │ ──────────→ │  Query Service  │
│  (Postman)      │             │   (Port 3003)   │
└─────────────────┘             └─────────────────┘
                                         │
                                         │ TCP
                                         ▼
                                ┌─────────────────┐
                                │ Product Service │
                                │  (Port 3002)    │
                                └─────────────────┘
                                         │
                                         │ MongoDB
                                         ▼
                                ┌─────────────────┐
                                │   MongoDB       │
                                │  (Port 27017)   │
                                └─────────────────┘
```

## 🚀 **Setup Instructions**

### **1. Environment Variables**
Create a Postman environment with:
- `product_service_url`: `http://localhost:3001/api`
- `query_service_url`: `http://localhost:3003/api`

### **2. Collection Structure**
Create a collection called "TCP Microservices" with folders:
- **Product Service (M1)** - Direct HTTP calls
- **Query Service (M2)** - HTTP calls that use TCP internally

---

## 🧪 **Product Service (M1) - Direct HTTP Tests**

### **1. Create Product**
- **Method**: `POST`
- **URL**: `{{product_service_url}}/products`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features including titanium design and A17 Pro chip",
  "price": 999.99,
  "category": "electronics",
  "brand": "Apple",
  "sku": "IPH15PRO-256GB-BLACK",
  "status": "active",
  "weightInGrams": 187,
  "images": ["https://example.com/iphone15pro1.jpg"],
  "tags": ["smartphone", "5G", "camera", "titanium"],
  "specifications": {
    "Storage": "256GB",
    "Color": "Black Titanium",
    "Screen": "6.1 inch",
    "Chip": "A17 Pro"
  },
  "isFeatured": true,
  "releaseDate": "2024-01-15T00:00:00.000Z"
}
```

### **2. Get All Products**
- **Method**: `GET`
- **URL**: `{{product_service_url}}/products`

---

## 🔍 **Query Service (M2) - TCP Communication Tests**

### **1. Get All Products (TCP Call)**
- **Method**: `GET`
- **URL**: `{{query_service_url}}/product-query`
- **Query Params**:
  - `page`: `1`
  - `limit`: `10`

**Expected Response**:
```json
{
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "name": "iPhone 15 Pro",
      "price": 999.99,
      "category": "electronics",
      "brand": "Apple"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "hasNext": false,
  "hasPrev": false
}
```

### **2. Search with Filters (TCP Call)**
- **Method**: `GET`
- **URL**: `{{query_service_url}}/product-query/search`
- **Query Params**:
  - `search`: `iPhone`
  - `category`: `electronics`
  - `minPrice`: `500`
  - `maxPrice`: `1000`
  - `isFeatured`: `true`
  - `page`: `1`
  - `limit`: `5`

### **3. Search by Date Range (TCP Call)**
- **Method**: `GET`
- **URL**: `{{query_service_url}}/product-query/date-range`
- **Query Params**:
  - `startDate`: `2024-01-01T00:00:00.000Z`
  - `endDate`: `2024-12-31T23:59:59.999Z`

### **4. Search by Text (TCP Call)**
- **Method**: `GET`
- **URL**: `{{query_service_url}}/product-query/text-search`
- **Query Params**:
  - `q`: `iPhone`

---

## 🧪 **Test Scenarios**

### **Scenario 1: Basic TCP Communication**
1. **Create Product** (M1)
2. **Get All Products** (M2 via TCP)
3. **Verify**: Data flows from M1 → TCP → M2

### **Scenario 2: Search with Date Filters**
1. **Create Multiple Products** with different dates
2. **Search by Date Range** (M2 via TCP)
3. **Verify**: Date filtering works via TCP

### **Scenario 3: Search with Text Filters**
1. **Create Products** with different names/brands
2. **Search by Text** (M2 via TCP)
3. **Verify**: Text search works via TCP

### **Scenario 4: Pagination via TCP**
1. **Create Multiple Products**
2. **Test Pagination** (M2 via TCP)
3. **Verify**: Pagination works correctly

---

## 📊 **Expected Response Formats**

### **Successful TCP Response (200)**
```json
{
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "name": "iPhone 15 Pro",
      "description": "Latest iPhone with advanced features...",
      "price": 999.99,
      "category": "electronics",
      "brand": "Apple",
      "sku": "IPH15PRO-256GB-BLACK",
      "status": "active",
      "weightInGrams": 187,
      "images": ["https://example.com/iphone15pro1.jpg"],
      "tags": ["smartphone", "5G", "camera"],
      "specifications": {
        "Storage": "256GB",
        "Color": "Black Titanium"
      },
      "isFeatured": true,
      "releaseDate": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "createdBy": "system",
      "updatedBy": "system"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "hasNext": false,
  "hasPrev": false
}
```

### **TCP Communication Error (500)**
```json
{
  "statusCode": 500,
  "message": "Failed to fetch products from Product Service",
  "error": "Internal Server Error"
}
```

---

## 🎯 **Testing Checklist**

### **TCP Communication Tests**
- [ ] M2 can connect to M1 via TCP
- [ ] Data flows correctly from M1 → TCP → M2
- [ ] Error handling works when TCP connection fails
- [ ] Pagination works via TCP
- [ ] Search filters work via TCP
- [ ] Date range filtering works via TCP
- [ ] Text search works via TCP

### **Performance Tests**
- [ ] TCP communication is fast
- [ ] Large datasets handle pagination correctly
- [ ] Multiple concurrent requests work
- [ ] Connection pooling works

### **Error Handling Tests**
- [ ] M1 service down → M2 returns proper error
- [ ] Invalid TCP payload → Proper error response
- [ ] Network issues → Graceful degradation

---

## 🔧 **Troubleshooting**

### **Common Issues**

1. **TCP Connection Failed**
   - Check if M1 is running on port 3002
   - Verify firewall settings
   - Check network connectivity

2. **Data Not Flowing**
   - Verify M1 has data in MongoDB
   - Check TCP message patterns match
   - Verify ClientProxy configuration

3. **Pagination Issues**
   - Check if pagination parameters are passed correctly
   - Verify total count calculation
   - Check page/limit validation

### **Debug Commands**
```bash
# Check if services are running
netstat -ano | findstr :3001
netstat -ano | findstr :3002
netstat -ano | findstr :3003

# Test TCP connection
telnet localhost 3002

# Check MongoDB
node setup-mongodb.js
```

---

## 🚀 **Quick Start**

### **1. Start Services**
```bash
# Terminal 1 - Product Service (M1)
cd product-service
npm run start:dev

# Terminal 2 - Query Service (M2)
cd product-query-service
npm run start:dev
```

### **2. Test TCP Communication**
```bash
# Run comprehensive tests
node test-tcp-communication.js
```

### **3. Postman Testing**
1. Import the collection
2. Set up environment variables
3. Run the test scenarios
4. Verify TCP communication works

---

## 📚 **Swagger Documentation**
- **Product Service**: `http://localhost:3001/api/docs`
- **Query Service**: `http://localhost:3003/api/docs`

## 🔌 **TCP Ports**
- **Product Service TCP**: `localhost:3002`
- **Product Service HTTP**: `localhost:3001`
- **Query Service HTTP**: `localhost:3003`

Your TCP microservice communication is now ready for comprehensive testing! 🎉 