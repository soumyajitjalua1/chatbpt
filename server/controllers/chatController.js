const Chat = require('../models/Chat');
const User = require('../models/User'); // Import User model
const mongoose = require('mongoose');
const { getAzureChatCompletion } = require('../services/openaiService'); // Import the service

const FREE_TIER_MESSAGE_LIMIT = 10;
const AI_CONTEXT_MESSAGE_COUNT = 10; // Number of recent messages to send as context

// Helper function to check and reset daily limit
const checkAndResetLimit = (user) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of the day

    // Ensure lastMessageResetDate is a Date object before comparison
    const lastReset = user.lastMessageResetDate instanceof Date 
                        ? user.lastMessageResetDate 
                        : new Date(user.lastMessageResetDate || 0);

    if (lastReset < today) {
        user.dailyMessageCount = 0;
        user.lastMessageResetDate = today;
    }
};

// @desc    Get all chats for the logged-in user
// @route   GET /api/chats
// @access  Private
exports.getChats = async (req, res) => {
  try {
    // Fetch chats and sort by updatedAt descending (most recent first)
    const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error fetching chats' });
  }
};

// @desc    Create a new chat
// @route   POST /api/chats
// @access  Private
exports.createChat = async (req, res) => {
  // Title could optionally come from req.body if needed
  const { title = 'New Chat' } = req.body; 

  try {
    const newChat = new Chat({
      user: req.user._id,
      title: title,
      messages: [], // Start with empty messages
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Server error creating chat' });
  }
};

// @desc    Add a USER message, trigger AI response, save both
// @route   POST /api/chats/:chatId/messages 
// @access  Private
// NOTE: This endpoint now only accepts USER messages from the frontend.
// The assistant message is generated and saved internally.
exports.addMessage = async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body; // Only expect 'content' from user
  const userId = req.user._id; 

  // Basic validation
  if (!content) return res.status(400).json({ message: 'Message content is required' });
  if (!mongoose.Types.ObjectId.isValid(chatId)) return res.status(400).json({ message: 'Invalid chat ID format' });

  try {
    // Find both chat and user
    const [chat, user] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId) 
    ]);

    // Check existence and authorization
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    if (!user) return res.status(404).json({ message: 'User not found' }); 
    if (chat.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'User not authorized to modify this chat' });
    }

    // 1. Save the User message
    const userMessage = { content, role: 'user', timestamp: new Date() };
    chat.messages.push(userMessage);
    chat.updatedAt = Date.now(); 
    await chat.save(); // Save user message immediately

    // --- Prepare message history for AI (Last N messages) --- 
    const recentMessages = chat.messages.slice(-AI_CONTEXT_MESSAGE_COUNT);
    const messageHistoryForAI = recentMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user', // Ensure roles are correct for API
        content: msg.content
    }));
    // --- End message history prep --- 

    // 2. Call Azure OpenAI Service
    let aiResponseContent = '';
    let aiError = null;
    try {
        // Pass only the recent history
        aiResponseContent = await getAzureChatCompletion(messageHistoryForAI);
    } catch (error) {
        console.error("AI Service Call Error:", error);
        aiError = error; // Store error to handle later
        // Don't immediately fail, we still saved the user message
        // We could potentially send a specific error message back to the user
        aiResponseContent = "Sorry, I encountered an error trying to respond."; // Default error message
    }

    // 3. Check Tier Limit *before* saving Assistant message
    let limitExceeded = false;
    if (user.subscriptionTier === 'free') {
        checkAndResetLimit(user);
        if (user.dailyMessageCount >= FREE_TIER_MESSAGE_LIMIT) {
            limitExceeded = true;
            console.log(`User ${userId} message limit hit. AI response not saved.`);
        } else {
            // Increment only if limit not hit and AI call succeeded (or has default error msg)
             user.dailyMessageCount += 1;
        }
    }

    // 4. Save Assistant message (if limit not exceeded)
    let finalChatState = chat; // Start with chat state after user msg
    if (!limitExceeded) {
        const assistantMessage = { 
            content: aiResponseContent, 
            role: 'assistant', 
            timestamp: new Date() 
        };
        chat.messages.push(assistantMessage);
        chat.updatedAt = Date.now();

        // Save chat and potentially updated user count
        if (user.isModified()) { 
             [, finalChatState] = await Promise.all([user.save(), chat.save()]);
        } else {
            finalChatState = await chat.save();
        }
    } else if (user.isModified()) {
        // Save user even if limit exceeded (because date might have reset)
        await user.save(); 
    }

    // 5. Return final state
    res.status(201).json({
        // Return the chat state including the assistant message (if saved)
        chat: finalChatState, 
        limitExceeded: limitExceeded, // Let frontend know if limit was hit
        aiError: aiError ? aiError.message : null // Send back AI error message if occurred
    });

  } catch (error) {
    console.error('Error processing addMessage:', error);
    // Handle potential errors during initial chat/user fetch or final save
    res.status(500).json({ message: 'Server error processing message' });
  }
};

// @desc    Delete a specific chat
// @route   DELETE /api/chats/:chatId
// @access  Private
exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;

  // Validate chatId format
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: 'Invalid chat ID format' });
  }

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      // If chat doesn't exist, maybe it was already deleted. Return success.
      return res.status(200).json({ message: 'Chat not found or already deleted' });
    }

    // Ensure the chat belongs to the logged-in user
    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this chat' });
    }

    await chat.deleteOne(); // Use deleteOne on the document instance

    res.status(200).json({ message: 'Chat deleted successfully', deletedChatId: chatId });

  } catch (error) { // Catch potential errors during deletion
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Server error deleting chat' });
  }
}; 