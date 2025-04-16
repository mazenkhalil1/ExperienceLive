const express = require('express');
const router = express.Router();

const authController= require('../controllers/authController');
const authorizationMiddleware = require('../middleware/authorizationmiddleware');

router.post('/register',authController.register);

router.post('/login', authController.login);

 // Ensure this route is correctly defined
//router.post('/login', login);

module.exports = router;

