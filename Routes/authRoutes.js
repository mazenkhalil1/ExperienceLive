const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/auth/api/v1/register', authController.register); // Ensure this route is correctly defined
router.post('/auth/api/v1/login', authController.login);

module.exports = router;

