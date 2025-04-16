const express = require('express');
const router = express.Router();
const { upgradeTier } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protect the upgrade route
router.post('/upgrade', protect, upgradeTier);

module.exports = router; 