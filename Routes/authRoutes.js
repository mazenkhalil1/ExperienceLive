const express = require('express');
const router = express.Router();
const authController = require('../controllers/userController');


router.post('/register', userController.register); // Ensure this route is correctly defined
//router.post('/login', login);

module.exports = router;

