const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/ProductService';

async function testMongoConnection() {
  console.log('🔍 Testing MongoDB connection...');
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    const db = client.db('product-service');
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('✅ MongoDB connection test completed successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Make sure MongoDB is running on your system.');
    console.log('   You can start MongoDB with: mongod');
  }
}

testMongoConnection().catch(console.error); 