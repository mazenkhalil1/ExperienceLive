const express = require('express');
const router = express.Router();
const authController = require('../controllers/userController');


const authController = require('../controllers/authController');
router.post('/register', authController.register);
 // Ensure this route is correctly defined
//router.post('/login', login);

module.exports = router;

