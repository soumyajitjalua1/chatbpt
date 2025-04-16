const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Utility function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in the model
    });

    if (user) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        // Don't send the token in the JSON response, it's in the cookie
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email, explicitly select password
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password, user.password))) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user auth status (if logged in via cookie)
// @route   GET /api/auth/status
// @access  Private (uses protect middleware)
exports.getAuthStatus = async (req, res) => {
  // If the protect middleware succeeded, req.user is populated
  if (req.user) {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        subscriptionTier: req.user.subscriptionTier,
    });
  } else {
    // This case should ideally not be reached if protect middleware works correctly
    res.status(401).json({ message: 'Not authorized' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private (needs user logged in to logout)
exports.logout = (req, res) => {
  res.cookie('token', '', { // Clear the token cookie
    httpOnly: true,
    expires: new Date(0), // Set expiry date to the past
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'User logged out successfully' });
}; 