require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend dev server
    credentials: true // Allow cookies to be sent
}));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes); // Mount user routes

// Basic root route (optional)
app.get('/', (req, res) => {
  res.send('ChatBPT Backend API Running');
});

const PORT = process.env.PORT || 5000; // Use environment variable or default

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 