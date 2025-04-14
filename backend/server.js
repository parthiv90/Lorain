const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// CORS configuration - allow frontend requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection with more flexible options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: true,
  retryWrites: true,
})
  .then(() => {
    console.log('MongoDB Connected Successfully');
    console.log('Database Name:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.error('Please check your connection string and credentials');
    // Don't exit, allow server to run even if DB connection fails initially
    console.log('Server will continue running, but MongoDB functionality may not work');
  });

// Check for connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Connection success event
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully');
});

// Test route to check DB connection
app.get('/test-db', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.json({ 
      status: 'success', 
      message: 'Database connected successfully',
      database: mongoose.connection.name,
      connectionState: 'connected' 
    });
  } else {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database not connected',
      connectionState: mongoose.connection.readyState,
      states: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }
    });
  }
});

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));