require('dotenv').config();
const mongoose = require('mongoose');

// Different connection string variations to test
const connectionStrings = [
  // Original format with database name
  'mongodb+srv://cecilbezalel:Cb200300%21@cluster0.mc5mxnb.mongodb.net/mybudgeteer?retryWrites=true&w=majority&appName=Cluster0',
  
  // Without database name
  'mongodb+srv://cecilbezalel:Cb200300%21@cluster0.mc5mxnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  
  // Simplified options
  'mongodb+srv://cecilbezalel:Cb200300%21@cluster0.mc5mxnb.mongodb.net/mybudgeteer?retryWrites=true&w=majority',
  
  // Without URL encoding (if special chars aren't the issue)
  'mongodb+srv://cecilbezalel:Cb200300!@cluster0.mc5mxnb.mongodb.net/mybudgeteer?retryWrites=true&w=majority&appName=Cluster0',
  
  // Different password encoding
  'mongodb+srv://cecilbezalel:Cb200300%2521@cluster0.mc5mxnb.mongodb.net/mybudgeteer?retryWrites=true&w=majority&appName=Cluster0',
];

async function testConnections() {
  console.log('🔍 Testing different MongoDB Atlas connection strings...\n');
  
  for (let i = 0; i < connectionStrings.length; i++) {
    console.log(`\n🧪 Test ${i + 1}: Testing connection string variant...`);
    console.log(`URI: ${connectionStrings[i].replace(/:.*@/, ':***@')}`); // Hide password
    
    try {
      await mongoose.connect(connectionStrings[i]);
      console.log('✅ SUCCESS! Connection established!');
      
      // Test basic operation
      const testCollection = mongoose.connection.db.collection('connection_test');
      await testCollection.insertOne({ test: 'atlas_connection', timestamp: new Date() });
      console.log('✅ Database write operation successful!');
      
      await testCollection.deleteOne({ test: 'atlas_connection' });
      console.log('✅ Database cleanup successful!');
      
      await mongoose.disconnect();
      console.log('✅ This connection string works! Use this one.\n');
      
      console.log('🎉 Working connection string:');
      console.log(connectionStrings[i]);
      process.exit(0);
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      
      if (mongoose.connection.readyState !== 0) {
        try {
          await mongoose.disconnect();
        } catch (disconnectError) {
          // Ignore disconnect errors
        }
      }
    }
  }
  
  console.log('\n❌ All connection string variants failed.');
  console.log('\n📋 Next steps to troubleshoot:');
  console.log('1. Check MongoDB Atlas Dashboard > Database Access > Database Users');
  console.log('2. Verify username "cecilbezalel" exists');
  console.log('3. Verify password "Cb200300!" is correct');
  console.log('4. Check Network Access > IP Access List');
  console.log('5. Add 0.0.0.0/0 to allow all IPs (for testing only)');
  console.log('6. Get fresh connection string from Atlas dashboard');
}

testConnections();
