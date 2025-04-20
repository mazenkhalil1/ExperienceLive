const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Forget password
router.put('/forgetPassword', authController.forgetPassword);

// Reset password
router.put('/resetPassword', authController.resetPassword);

// Protected routes
router.get('/verify-token', authenticateToken, authController.checkToken);

module.exports = router;
