// Placeholder for authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, getAuthStatus, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout); // Logout doesn't strictly need protection, but clearing cookie is user-specific
router.get('/status', protect, getAuthStatus); // Protect the status route

module.exports = router; 