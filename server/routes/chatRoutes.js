// Placeholder for chatRoutes.js
const express = require('express');
const router = express.Router();
const { getChats, createChat, addMessage, deleteChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Apply the protect middleware to all chat routes
router.use(protect);

router.route('/')
  .get(getChats)
  .post(createChat);

router.route('/:chatId/messages')
  .post(addMessage);

router.route('/:chatId')
  .delete(deleteChat);

module.exports = router; 