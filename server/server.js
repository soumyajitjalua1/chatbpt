require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://3.108.221.169:3000', 
    'https://chatbpt.vercel.app/' 
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('ChatBPT Backend API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
