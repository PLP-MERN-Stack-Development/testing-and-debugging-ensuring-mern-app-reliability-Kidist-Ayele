// setup-db.js - Script to set up test database

const mongoose = require('mongoose');
require('dotenv').config();

const connectTestDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-blog-test';
    await mongoose.connect(mongoUri);
    console.log('Test database connected successfully');
    
    // Optionally seed test data here
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
};

connectTestDB();

