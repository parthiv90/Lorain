const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    // Prepare response without password
    const result = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      cart: user.cart || [],
      wishlist: user.wishlist || [],
      orderHistory: user.orderHistory || [],
      lastLogin: user.lastLogin
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to cart
router.post('/cart', authMiddleware, async (req, res) => {
  try {
    const { product } = req.body;
    const user = req.user;
    
    if (!product || !product.id) {
      return res.status(400).json({ message: 'Product information required' });
    }
    
    // Check if product already in cart
    const existingProductIndex = user.cart.findIndex(item => 
      item.id === product.id && 
      item.selectedSize === product.selectedSize && 
      item.selectedColor === product.selectedColor
    );
    
    if (existingProductIndex !== -1) {
      // If product exists, increase quantity
      user.cart[existingProductIndex].quantity += product.quantity || 1;
    } else {
      // Add new product to cart
      user.cart.push({
        ...product,
        quantity: product.quantity || 1,
        addedAt: new Date()
      });
    }
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Product added to cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/cart/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, selectedSize, selectedColor } = req.body;
    const user = req.user;
    
    // Find product in cart
    const productIndex = user.cart.findIndex(item => 
      item.id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
    
    if (quantity <= 0) {
      // Remove product from cart if quantity is 0 or negative
      user.cart.splice(productIndex, 1);
    } else {
      // Update quantity
      user.cart[productIndex].quantity = quantity;
    }
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Cart updated',
      cart: user.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from cart
router.delete('/cart/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedSize, selectedColor } = req.query;
    const user = req.user;
    
    // Find product in cart
    const productIndex = user.cart.findIndex(item => 
      item.id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
    
    // Remove product from cart
    user.cart.splice(productIndex, 1);
    await user.save();
    
    res.status(200).json({ 
      message: 'Product removed from cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to wishlist
router.post('/wishlist', authMiddleware, async (req, res) => {
  try {
    const { product } = req.body;
    const user = req.user;
    
    if (!product || !product.id) {
      return res.status(400).json({ message: 'Product information required' });
    }
    
    // Check if product already in wishlist
    const existingProductIndex = user.wishlist.findIndex(item => 
      item.id === product.id && 
      item.selectedSize === product.selectedSize && 
      item.selectedColor === product.selectedColor
    );
    
    if (existingProductIndex === -1) {
      // Add product to wishlist (if not already there)
      user.wishlist.push({
        ...product,
        addedAt: new Date()
      });
      
      await user.save();
    }
    
    res.status(200).json({ 
      message: 'Product added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/wishlist/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedSize, selectedColor } = req.query;
    const user = req.user;
    
    // Find product in wishlist
    const productIndex = user.wishlist.findIndex(item => 
      item.id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }
    
    // Remove product from wishlist
    user.wishlist.splice(productIndex, 1);
    await user.save();
    
    res.status(200).json({ 
      message: 'Product removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/orders', authMiddleware, async (req, res) => {
  try {
    console.log('Order request received with data:', req.body);
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;
    const user = req.user;
    
    if (!products || !products.length || !totalAmount) {
      console.log('Invalid order data:', { products, totalAmount });
      return res.status(400).json({ message: 'Invalid order data' });
    }
    
    // Generate a unique order ID
    const orderId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    console.log('Generated order ID:', orderId);
    
    // Create new order
    const newOrder = {
      orderId,
      products,
      totalAmount,
      orderDate: new Date(),
      status: 'Processing',
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery'
    };
    
    console.log('Created new order object:', newOrder);
    console.log('User email:', user.email);
    
    // Add to order history
    user.orderHistory.push(newOrder);
    
    // Clear cart after successful order
    user.cart = [];
    
    await user.save();
    console.log('User data saved with new order');
    
    // Send order confirmation email
    try {
      console.log('Attempting to send order confirmation email');
      const emailService = require('../services/emailService');
      const emailResult = await emailService.sendOrderConfirmationEmail(
        user.email,
        user.name || `${user.firstName} ${user.lastName}`,
        newOrder
      );
      
      console.log('Email sending result:', emailResult);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the order if email fails
    }
    
    res.status(201).json({ 
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get order history
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    res.status(200).json({ 
      orderHistory: user.orderHistory || []
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change user password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Import bcrypt
    const bcrypt = require('bcryptjs');
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 