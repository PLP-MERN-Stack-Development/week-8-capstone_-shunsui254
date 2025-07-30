require('dotenv').config();
const mongoose = require('mongoose');

// Test your fresh connection string here
const ATLAS_URI = 'mongodb+srv://cecilbezalel:Cb200300!@cluster0.mc5mxnb.mongodb.net/mybudgeteer?retryWrites=true&w=majority&appName=Cluster0';

async function testAtlasConnection() {
  console.log('🔍 Testing MongoDB Atlas connection after fixing credentials...\n');
  
  try {
    console.log('📡 Connecting to Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    console.log('🧪 Testing database operations...');
    const testCollection = mongoose.connection.db.collection('atlas_test');
    
    await testCollection.insertOne({ 
      test: 'atlas_working', 
      timestamp: new Date(),
      message: 'Atlas connection successful!'
    });
    console.log('✅ Database write successful!');
    
    const document = await testCollection.findOne({ test: 'atlas_working' });
    console.log('✅ Database read successful:', document.message);
    
    await testCollection.deleteOne({ test: 'atlas_working' });
    console.log('✅ Database cleanup successful!');
    
    await mongoose.disconnect();
    console.log('✅ Atlas connection test completed successfully!\n');
    
    console.log('🎉 Your MongoDB Atlas is now working!');
    console.log('🚀 You can now start your backend server with Atlas connection.');
    
  } catch (error) {
    console.error('❌ Atlas connection still failing:', error.message);
    console.log('\n📋 Double-check these in Atlas dashboard:');
    console.log('1. Database user "cecilbezalel" exists with correct password');
    console.log('2. User has "Read and write to any database" privileges');
    console.log('3. Network access allows your IP or 0.0.0.0/0');
    console.log('4. Cluster is running and accessible');
  }
}

testAtlasConnection();
