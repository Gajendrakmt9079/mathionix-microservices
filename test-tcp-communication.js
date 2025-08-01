const axios = require('axios');

const PRODUCT_SERVICE_URL = 'http://localhost:3001/api';
const QUERY_SERVICE_URL = 'http://localhost:3003/api';

// Sample product data for testing
const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features including titanium design and A17 Pro chip',
    price: 999.99,
    category: 'electronics',
    brand: 'Apple',
    sku: 'IPH15PRO-256GB-BLACK',
    status: 'active',
    weightInGrams: 187,
    images: ['https://example.com/iphone15pro1.jpg'],
    tags: ['smartphone', '5G', 'camera', 'titanium'],
    specifications: {
      'Storage': '256GB',
      'Color': 'Black Titanium',
      'Screen': '6.1 inch',
      'Chip': 'A17 Pro'
    },
    isFeatured: true,
    releaseDate: '2024-01-15T00:00:00.000Z'
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Premium Android smartphone with AI features and excellent camera system',
    price: 899.99,
    category: 'electronics',
    brand: 'Samsung',
    sku: 'SAMS24-512GB-PURPLE',
    status: 'active',
    weightInGrams: 168,
    images: ['https://example.com/s24-1.jpg'],
    tags: ['smartphone', '5G', 'AI', 'camera'],
    specifications: {
      'Storage': '512GB',
      'Color': 'Purple',
      'Screen': '6.2 inch',
      'Chip': 'Snapdragon 8 Gen 3'
    },
    isFeatured: false,
    releaseDate: '2024-02-01T00:00:00.000Z'
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology for maximum cushioning',
    price: 150.00,
    category: 'sports',
    brand: 'Nike',
    sku: 'NIKE-AM270-BLACK-10',
    status: 'active',
    weightInGrams: 320,
    images: ['https://example.com/nike270-1.jpg'],
    tags: ['running', 'comfort', 'cushioning'],
    specifications: {
      'Size': '10',
      'Color': 'Black/White',
      'Type': 'Running',
      'Technology': 'Air Max'
    },
    isFeatured: true,
    releaseDate: '2023-06-15T00:00:00.000Z'
  }
];

async function testProductService() {
  console.log('🧪 Testing Product Service (M1)...\n');

  try {
    // Test 1: Create products
    console.log('1. Creating products...');
    const createdProducts = [];
    
    for (const product of sampleProducts) {
      try {
        const response = await axios.post(`${PRODUCT_SERVICE_URL}/products`, product);
        createdProducts.push(response.data);
        console.log(`   ✅ Created: ${response.data.name} (ID: ${response.data._id})`);
      } catch (error) {
        console.log(`   ❌ Failed to create ${product.name}:`, error.response?.data?.message || error.message);
      }
    }

    // Test 2: Get all products
    console.log('\n2. Getting all products...');
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
      console.log(`   ✅ Found ${response.data.length} products`);
    } catch (error) {
      console.log('   ❌ Failed to get products:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Product Service test failed:', error.message);
  }
}

async function testQueryServiceTCP() {
  console.log('\n🔍 Testing Product Query Service (M2) - TCP Communication...\n');

  try {
    // Test 1: Get all products via TCP
    console.log('1. Getting all products via TCP...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query?page=1&limit=10`);
      console.log(`   ✅ Found ${response.data.data.length} products (Total: ${response.data.total})`);
      console.log(`   📊 Pagination: Page ${response.data.page}/${response.data.totalPages}`);
    } catch (error) {
      console.log('   ❌ Failed to get products via TCP:', error.response?.data?.message || error.message);
    }

    // Test 2: Search with filters via TCP
    console.log('\n2. Searching products with filters via TCP...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query/search`, {
        params: {
          search: 'iPhone',
          category: 'electronics',
          minPrice: 500,
          maxPrice: 1000,
          isFeatured: true,
          page: 1,
          limit: 5
        }
      });
      console.log(`   ✅ Found ${response.data.data.length} products matching filters`);
      console.log(`   📊 Pagination: Page ${response.data.page}/${response.data.totalPages}`);
    } catch (error) {
      console.log('   ❌ Failed to search with filters:', error.response?.data?.message || error.message);
    }

    // Test 3: Search by date range via TCP
    console.log('\n3. Searching by date range via TCP...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query/date-range`, {
        params: {
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.999Z'
        }
      });
      console.log(`   ✅ Found ${response.data.length} products in date range`);
    } catch (error) {
      console.log('   ❌ Failed to search by date range:', error.response?.data?.message || error.message);
    }

    // Test 4: Search by text via TCP
    console.log('\n4. Searching by text via TCP...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query/text-search`, {
        params: {
          q: 'iPhone'
        }
      });
      console.log(`   ✅ Found ${response.data.length} products matching text search`);
    } catch (error) {
      console.log('   ❌ Failed to search by text:', error.response?.data?.message || error.message);
    }

    // Test 5: Test pagination
    console.log('\n5. Testing pagination...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query/search`, {
        params: {
          page: 1,
          limit: 2
        }
      });
      console.log(`   ✅ Page 1: ${response.data.data.length} products`);
      console.log(`   📊 Total: ${response.data.total}, Pages: ${response.data.totalPages}`);
      console.log(`   🔗 Has Next: ${response.data.hasNext}, Has Prev: ${response.data.hasPrev}`);
    } catch (error) {
      console.log('   ❌ Failed to test pagination:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Query Service TCP test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting TCP Communication Tests...\n');
  
  // Wait for services to be ready
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testProductService();
  await testQueryServiceTCP();
  
  console.log('\n✅ TCP Communication Tests completed!');
  console.log('\n📋 Service URLs:');
  console.log(`   Product Service (M1): ${PRODUCT_SERVICE_URL}`);
  console.log(`   Query Service (M2): ${QUERY_SERVICE_URL}`);
  console.log(`   Product Service Swagger: ${PRODUCT_SERVICE_URL}/docs`);
  console.log(`   Query Service Swagger: ${QUERY_SERVICE_URL}/docs`);
  console.log('\n🔌 TCP Communication:');
  console.log('   M2 (Query Service) → TCP → M1 (Product Service) on port 3002');
}

// Run tests
runTests().catch(console.error); 