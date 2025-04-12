const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lorain_db')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// API Routes - Define all API routes before static serving
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Static file serving
const buildPath = path.join(__dirname, '../build');
if (fs.existsSync(buildPath)) {
  console.log('React build directory found, serving static files');
  app.use(express.static(buildPath));
  
  // For all non-API requests, serve the React app
  app.get('/*', function(req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.log('No React build directory found');
  app.get('/', (req, res) => {
    res.send('API server is running. Frontend is not built yet.');
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));