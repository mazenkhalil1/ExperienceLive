const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/api/v1/register',authController.register);
router.post('/api/v1/login', authController.login);

 // Ensure this route is correctly defined
//router.post('/login', login);

module.exports = router;

