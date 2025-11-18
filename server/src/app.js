// app.js - Express app configuration (for testing)
const express = require('express');
const cors = require('cors');
const path = require('path');

// Register models so Mongoose knows about them
require('./models/User');
require('./models/Category');
require('./models/Post');

// Import routes
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log requests in development mode
const logger = require('./utils/logger');
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('MERN Blog API is running');
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;

