const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Use mongoose.Schema.Types.ObjectId for unique IDs within the array?
  // Or rely on frontend-generated IDs if needed for optimistic UI updates?
  // For simplicity, let's use default _id for now.
  // id: { type: String, required: true, unique: true },
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: 'New Chat',
  },
  messages: [messageSchema], // Array of message subdocuments
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Index the user field for faster querying of user's chats
chatSchema.index({ user: 1 });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat; 