const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// CORS configuration - allow frontend requests with better error handling
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Parse JSON requests with error handling
app.use(express.json());

// Error handler for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON Parse Error:', err.message);
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  next();
});

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

const productRoutes = require('./routes/product');
app.use('/products', productRoutes);

const PORT = process.env.PORT || 3001;
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API available at http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'An unexpected error occurred on the server',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Start the server with initial port
startServer(PORT);