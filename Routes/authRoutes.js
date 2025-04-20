const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authenticationmiddleware');
const mongoose = require('mongoose');
const User = require('../models/userModel');

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    console.log('Connection state:', mongoose.connection.readyState);
    
    // Try to access the users collection
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const users = await db.collection('users').find({}).toArray();
    
    return res.json({
      success: true,
      connectionState: mongoose.connection.readyState,
      collections: collections.map(c => c.name),
      userCount: users.length,
      users: users.map(u => ({ email: u.email, role: u.role }))
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Test direct database operation
router.post('/test-register', async (req, res) => {
  try {
    console.log('\n=== Test Register Start ===');
    console.log('Body:', req.body);
    
    const { email, password, name, role } = req.body;
    
    // Try direct database operation
    const db = mongoose.connection.db;
    const result = await db.collection('users').insertOne({
      email,
      password,
      name,
      role: role || 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Insert result:', result);
    console.log('=== Test Register End ===\n');
    
    return res.json({
      success: true,
      message: 'Test registration successful',
      userId: result.insertedId
    });
  } catch (error) {
    console.error('Test register failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/forgetPassword', authController.forgetPassword);
router.get('/check-token', authMiddleware, authController.checkToken);

// Test route to verify token and user data
router.get('/verify-token', authMiddleware, (req, res) => {
  console.log('Token verification test:');
  console.log('Headers:', req.headers);
  console.log('User data:', req.user);
  
  res.json({
    message: 'Token verification',
    headers: req.headers,
    userData: req.user
  });
});

module.exports = router;
