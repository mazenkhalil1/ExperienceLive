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
    
    return res.json({
      success: true,
      connectionState: mongoose.connection.readyState,
      connectionString: process.env.MONGO_URI ? 'Set' : 'Not set'
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
router.put('/api/v1/forgetPassword', authController.forgetPassword);
router.put('/api/v1/resetPassword', authController.resetPassword);
router.get('/logOut', authController.logOut); // Add logout endpoint

// MFA related routes
router.post('/send-otp', authController.sendMfaOtp);
router.post('/verify-mfa', authController.verifyMfa);

// Protected routes
router.get('/verify-token', authMiddleware, authController.checkToken);

module.exports = router;
