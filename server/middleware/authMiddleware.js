const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  // Check for token in httpOnly cookie
  if (req.cookies && req.cookies.token) {
    try {
      // Get token from cookie
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (select excludes password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
          // Handle case where user associated with token no longer exists
          res.clearCookie('token');
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the protected route
    } catch (error) {
      console.error('Token verification failed:', error);
      res.clearCookie('token'); // Clear invalid token cookie
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect }; 