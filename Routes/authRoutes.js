const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/auth/api/v1/register', authController.register); // Ensure this route is correctly defined
router.post('/auth/api/v1/login', authController.login);

module.exports = router;