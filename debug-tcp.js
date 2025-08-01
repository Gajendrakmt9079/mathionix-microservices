const axios = require('axios');

const PRODUCT_SERVICE_URL = 'http://localhost:3001/api';
const QUERY_SERVICE_URL = 'http://localhost:3003/api';

async function debugTCP() {
  console.log('🔍 Debugging TCP Communication...\n');

  try {
    // Test 1: Check if Product Service is running
    console.log('1. Testing Product Service HTTP...');
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
      console.log(`   ✅ Product Service HTTP: Found ${response.data.length} products`);
    } catch (error) {
      console.log('   ❌ Product Service HTTP failed:', error.message);
      return;
    }

    // Test 2: Check if Query Service is running
    console.log('\n2. Testing Query Service HTTP...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query`);
      console.log(`   ✅ Query Service HTTP: Found ${response.data.length} products via TCP`);
    } catch (error) {
      console.log('   ❌ Query Service HTTP failed:', error.response?.data?.message || error.message);
    }

    // Test 3: Test direct search on Product Service
    console.log('\n3. Testing Product Service search...');
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/search`, {
        params: { category: 'electronics' }
      });
      console.log(`   ✅ Product Service search: Found ${response.data.length} electronics products`);
    } catch (error) {
      console.log('   ❌ Product Service search failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Test Query Service search (TCP call)
    console.log('\n4. Testing Query Service search (TCP)...');
    try {
      const response = await axios.get(`${QUERY_SERVICE_URL}/product-query/search`, {
        params: { category: 'electronics' }
      });
      console.log(`   ✅ Query Service search (TCP): Found ${response.data.length} electronics products`);
    } catch (error) {
      console.log('   ❌ Query Service search (TCP) failed:', error.response?.data?.message || error.message);
      
      // Check if it's a TCP connection issue
      if (error.response?.data?.message?.includes('TCP') || error.message.includes('TCP')) {
        console.log('\n🔧 TCP Connection Issue Detected!');
        console.log('   - Check if Product Service TCP is running on port 3002');
        console.log('   - Check if Query Service can connect to Product Service');
        console.log('   - Verify firewall settings');
      }
    }

  } catch (error) {
    console.log('❌ Debug failed:', error.message);
  }
}

debugTCP().catch(console.error); 