const fetch = require('node-fetch');
const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

// Test user registration endpoint manually
async function testRegistration() {
  try {
    console.log('Testing registration API...');
    const response = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser' + Math.floor(Math.random() * 10000) + '@example.com',
        password: 'Password123',
        acceptTerms: true
      }),
    });
    
    const data = await response.json();
    console.log('Registration response:', {
      status: response.status,
      data
    });
    
    // Now check if user exists
    await checkDatabase();
  } catch (error) {
    console.error('Test API error:', error);
  }
}

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for check');
    
    // Count users
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    // List all users (excluding passwords)
    if (userCount > 0) {
      const users = await User.find({}, { password: 0 });
      console.log('Users in database:');
      users.forEach(user => console.log(user));
    } else {
      console.log('No users found in database');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Database check error:', error);
  }
}

// Run the test
testRegistration(); 