const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    checkDatabase();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

async function checkDatabase() {
  try {
    // Check connection state
    console.log('Connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    // Count users
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    // List all users
    if (userCount > 0) {
      const users = await User.find({}, { password: 0 }); // Exclude password
      console.log('Users in database:');
      users.forEach(user => console.log(user));
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
} 