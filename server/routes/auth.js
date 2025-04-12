const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// JWT verification middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, acceptTerms } = req.body;
  
  console.log('Registration request received:', { firstName, lastName, email, acceptTerms });
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ 
      firstName, 
      lastName, 
      name: `${firstName} ${lastName}`, 
      email, 
      password: hashedPassword,
      acceptTerms: acceptTerms || false
    });

    console.log('Attempting to save user:', newUser);
    
    await newUser.save();
    console.log('User saved successfully to database');
    
    // Generate token for auto-login
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      result: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      },
      token
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'You have to register first to login' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      result: {
        id: user._id,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Verify token and get user data
router.get('/verify-token', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'You have to register first to login' });
    }
    
    res.status(200).json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      } 
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;