const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail, sendLoginSuccessEmail } = require('../services/emailService');

const router = express.Router();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register route - send OTP
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    console.log('Registration request received for:', email);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log(`OTP generated for ${email}: ${otp}`); // For testing, remove in production

    // Save OTP to database
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });
    
    // Create new OTP
    const otpDoc = await OTP.create({
      email,
      otp,
    });
    console.log('OTP saved to database with ID:', otpDoc._id);

    // Store user data temporarily (excluding password)
    const userData = {
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
    };

    // Store userData in session or cache (for simplicity, using a hidden field in response)
    const tempData = Buffer.from(JSON.stringify(userData)).toString('base64');
    
    // Try to send OTP email
    let emailSent = false;
    try {
      emailSent = await sendOTPEmail(email, otp);
      if (!emailSent) {
        console.log('Failed to send email, but continuing with registration process');
      } else {
        console.log('Email sent successfully to:', email);
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue with registration even if email fails
    }
    
    // Return appropriate message based on email status
    res.status(200).json({ 
      message: emailSent 
        ? 'OTP sent to your email' 
        : 'Registration initiated, but email delivery failed. Use console OTP for testing.',
      tempData,
      testOtp: process.env.NODE_ENV === 'production' ? undefined : otp // Include OTP in non-production for testing
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, tempData } = req.body;
    
    console.log('Verifying OTP for:', email);
    console.log('OTP received:', otp);
    console.log('tempData length:', tempData ? tempData.length : 'undefined');
    
    if (!email || !otp || !tempData) {
      console.error('Missing required fields:', { email: !!email, otp: !!otp, tempData: !!tempData });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find OTP in database
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      console.log('Invalid OTP or OTP expired for email:', email);
      return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }
    
    console.log('OTP verified successfully for email:', email);

    // Decode user data
    try {
      const userData = JSON.parse(Buffer.from(tempData, 'base64').toString());
      console.log('User data decoded successfully:', Object.keys(userData));
      
      // Create user
      const user = new User({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // Already hashed
        acceptTerms: true // Default to true since they completed verification
      });

      await user.save();
      console.log('User saved successfully to database');

      // Delete OTP record
      await OTP.deleteOne({ _id: otpRecord._id });
      console.log('OTP record deleted');

    res.status(201).json({ message: 'User registered successfully' });
    } catch (decodeError) {
      console.error('Error decoding user data:', decodeError);
      return res.status(400).json({ message: 'Invalid user data format' });
    }
  } catch (error) {
    console.error('OTP verification error details:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'You have to register first' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Prepare user data for response with fully populated cart and wishlist
    const result = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      token,
      cart: user.cart || [],
      wishlist: user.wishlist || [],
      orderHistory: user.orderHistory || []
    };

    console.log('User logged in successfully:', {
      email: user.email,
      cartItems: user.cart.length,
      wishlistItems: user.wishlist.length
    });

    // Send login success email
    try {
      await sendLoginSuccessEmail(user.email, user.name);
      console.log('Login success email sent');
    } catch (emailError) {
      console.error('Error sending login success email:', emailError);
      // Continue login process even if email fails
    }

    res.status(200).json({ result });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend OTP route
router.post('/resend-otp', async (req, res) => {
  try {
    const { email, tempData } = req.body;
    
    console.log('Resend OTP request for:', email);

    if (!email || !tempData) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Generate new OTP
    const otp = generateOTP();
    console.log(`New OTP for ${email}: ${otp}`);

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });
    
    // Create new OTP
    const otpDoc = await OTP.create({
      email,
      otp,
    });
    console.log('New OTP saved to database with ID:', otpDoc._id);

    // Try to send OTP email
    let emailSent = false;
    try {
      emailSent = await sendOTPEmail(email, otp);
      if (!emailSent) {
        console.log('Failed to send email, but continuing with process');
      } else {
        console.log('Email sent successfully to:', email);
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    // Return appropriate message based on email status
    res.status(200).json({ 
      message: emailSent 
        ? 'New OTP sent to your email' 
        : 'New OTP generated, but email delivery failed. Use console OTP for testing.',
      testOtp: process.env.NODE_ENV === 'production' ? undefined : otp // Include OTP in non-production for testing
    });
    
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

module.exports = router;