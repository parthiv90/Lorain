const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// CORS and JSON middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lorain_db')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// API Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Simple root route for API status
app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running' });
});

// Only attempt to serve static files if the build directory exists
const buildPath = path.join(__dirname, '../build');
if (fs.existsSync(buildPath)) {
  console.log('React build directory found, serving static files');
  
  // Serve static files directly
  app.use(express.static(buildPath));
  
  // Simplest catch-all route
  app.use((req, res, next) => {
    // Skip if it's an API route
    if (req.path.startsWith('/auth') || req.path.startsWith('/api')) {
      return next();
    }
    
    // Send the index.html for all other routes
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.log('No React build directory found');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 