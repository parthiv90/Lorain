const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail, sendLoginSuccessEmail, sendPasswordResetEmail } = require('../services/emailService');

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
      originalPassword: password // Store plain text password for recovery (NOT RECOMMENDED for production)
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

    // Create JWT with longer expiration
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Extend token duration to 7 days for better user experience
    );

    // Prepare user data for response with fully populated cart and wishlist
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      cart: user.cart || [],
      wishlist: user.wishlist || [],
      orderHistory: user.orderHistory || []
    };

    console.log('User logged in successfully:', {
      email: user.email,
      cartItems: user.cart.length,
      wishlistItems: user.wishlist.length,
      tokenGenerated: !!token
    });

    // Send login success email
    try {
      await sendLoginSuccessEmail(user.email, user.name);
      console.log('Login success email sent');
    } catch (emailError) {
      console.error('Error sending login success email:', emailError);
      // Continue login process even if email fails
    }

    // Return both token and user data at the top level for easier client access
    // This format ensures compatibility with existing frontend code
    res.status(200).json({ 
      token, 
      user: userData,
      result: userData, // Include result for backward compatibility
      success: true,
      message: 'Login successful'
    });
    
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

// Forgot password - generate and send OTP (Amazon style)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "This email hasn't been registered." });
    }
    if (!user.lastLogin) {
      return res.status(403).json({ message: "This user hasn't logged in before." });
    }
    if (!user.originalPassword) {
      return res.status(400).json({ message: 'Password recovery is not available for this account. Please contact support or reset your password.' });
    }
    // Send the original (plain text) password to the user's email
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: `LORAIN <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Lorain Account Password',
      html: `<h2>Your Lorain Account Password</h2><p>Your password is: <b>${user.originalPassword}</b></p><p>If you did not request this, please secure your account.</p>`
    };
    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Your password has been sent to your registered email.' });
    } catch (mailErr) {
      return res.status(500).json({ message: 'Failed to send password email.', details: mailErr.message });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error, please try again later', details: error.message });
  }
});

// Verify OTP for password reset (Amazon style)
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    // Find the OTP in database
    let otpRecord;
    try {
      otpRecord = await OTP.findOne({ email, otp });
      if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid or expired verification code' });
      }
    } catch (otpError) {
      console.error('Error finding OTP record:', otpError);
      return res.status(500).json({ message: 'Error verifying verification code' });
    }

    // Verify the user exists
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (userError) {
      console.error('Error finding user:', userError);
      return res.status(500).json({ message: 'Error locating user account' });
    }
    
    // Generate a session token for the password reset process
    const resetSession = jwt.sign(
      { email, otpVerified: true },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Short expiration for security
    );

    res.status(200).json({ 
      message: 'Verification successful', 
      resetSession,
      email
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Reset password with verified OTP session (Amazon style)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, resetSession, newPassword, confirmPassword } = req.body;
    
    if (!email || !resetSession || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Confirm passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Verify the reset session token
    let decodedSession;
    try {
      decodedSession = jwt.verify(resetSession, process.env.JWT_SECRET);
      if (!decodedSession.otpVerified || decodedSession.email !== email) {
        return res.status(400).json({ message: 'Invalid reset session' });
      }
    } catch (tokenError) {
      console.error('Error verifying reset session:', tokenError);
      return res.status(400).json({ message: 'Reset session expired or invalid' });
    }

    // Find user
    let user;
    try {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (userError) {
      console.error('Error finding user:', userError);
      return res.status(500).json({ message: 'Error locating user account' });
    }

    // Hash new password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return res.status(500).json({ message: 'Error securing your new password' });
    }
    
    // Update user password
    try {
      user.password = hashedPassword;
      await user.save();
    } catch (saveError) {
      console.error('Error saving updated password:', saveError);
      return res.status(500).json({ message: 'Error updating your password' });
    }
    
    // Delete all OTPs for this email
    try {
      await OTP.deleteMany({ email });
    } catch (deleteError) {
      console.error('Error deleting used OTPs:', deleteError);
      // Continue even if OTP deletion fails
    }

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

module.exports = router;