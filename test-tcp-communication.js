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

    // Test 3: Search products
    console.log('\n3. Searching products...');
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/search`, {
        params: {
          category: 'electronics',
          name: 'iPhone'
        }
      });
      console.log(`   ✅ Found ${response.data.length} products matching search criteria`);
    } catch (error) {
      console.log('   ❌ Failed to search products:', error.response?.data?.message || error.message);
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
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query`);
      console.log(`   ✅ Found ${response.data.length} products via TCP`);
    } catch (error) {
      console.log('   ❌ Failed to get products via TCP:', error.response?.data?.message || error.message);
    }

    // Test 2: Search with category filter via TCP
    console.log('\n2. Searching products by category via TCP...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query/search`, {
        params: {
          category: 'electronics'
        }
      });
      console.log(`   ✅ Found ${response.data.length} electronics products via TCP`);
    } catch (error) {
      console.log('   ❌ Failed to search by category:', error.response?.data?.message || error.message);
    }

    // Test 3: Search with name filter via TCP
    console.log('\n3. Searching products by name via TCP...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query/search`, {
        params: {
          name: 'iPhone'
        }
      });
      console.log(`   ✅ Found ${response.data.length} products matching "iPhone" via TCP`);
    } catch (error) {
      console.log('   ❌ Failed to search by name:', error.response?.data?.message || error.message);
    }

    // Test 4: Search with date range via TCP
    console.log('\n4. Searching products by date range via TCP...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query/search`, {
        params: {
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.999Z'
        }
      });
      console.log(`   ✅ Found ${response.data.length} products in date range via TCP`);
    } catch (error) {
      console.log('   ❌ Failed to search by date range:', error.response?.data?.message || error.message);
    }

    // Test 5: Combined search via TCP
    console.log('\n5. Combined search (category + name + date) via TCP...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query/search`, {
        params: {
          category: 'electronics',
          name: 'iPhone',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.999Z'
        }
      });
      console.log(`   ✅ Found ${response.data.length} products with combined filters via TCP`);
    } catch (error) {
      console.log('   ❌ Failed to search with combined filters:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Query Service TCP test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Simplified TCP Communication Tests...\n');
  
  // Wait for services to be ready
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testProductService();
  await testQueryServiceTCP();
  
  console.log('\n✅ Simplified TCP Communication Tests completed!');
  console.log('\n📋 Service URLs:');
  console.log(`   Product Service (M1): ${PRODUCT_SERVICE_URL}`);
  console.log(`   Query Service (M2): ${QUERY_SERVICE_URL}`);
  console.log(`   Product Service Swagger: ${PRODUCT_SERVICE_URL}/docs`);
  console.log(`   Query Service Swagger: ${QUERY_SERVICE_URL}/docs`);
  console.log('\n🔌 TCP Communication:');
  console.log('   M2 (Query Service) → TCP → M1 (Product Service) on port 3002');
  console.log('\n📝 Available Endpoints:');
  console.log('   Product Service:');
  console.log('     POST /api/products - Create product');
  console.log('     GET /api/products - Get all products');
  console.log('     GET /api/products/search - Search by category, name, date range');
  console.log('   Query Service (via TCP):');
  console.log('     GET /api/product-query - Get all products');
  console.log('     GET /api/product-query/search - Search by category, name, date range');
}

// Run tests
runTests().catch(console.error); 