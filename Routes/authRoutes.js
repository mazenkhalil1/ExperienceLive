const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Forget password
router.put('/forgetPassword', authController.forgetPassword);

module.exports = router;
