const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/test', (req, res) => {
  res.send('Auth routes are working');
});

module.exports = router;
