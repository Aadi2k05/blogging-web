// ai-blog-hub/server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; // Your MongoDB connection string

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// --- IMPORTANT: Serve static files BEFORE other routes ---
// This ensures that when you go to http://localhost:5000/, it serves index.html
app.use(express.static('public')); 

// Database Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Route for testing (this will now only be hit if no static file matches)
app.get('/', (req, res) => {
    res.send('AI Blog Hub Backend is running!');
});

// Use API Routes
app.use('/api', blogRoutes); // All API routes will be prefixed with /api

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

