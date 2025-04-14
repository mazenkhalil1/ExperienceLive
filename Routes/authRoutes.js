<<<<<<< HEAD
=======

>>>>>>> 7e4c6960ffba90835173ab9b4ac79ff7a50ea8d1
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

<<<<<<< HEAD
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
=======
const authController = require('../controllers/authController');
router.post('/auth/api/v1/register', authController.register); // Ensure this route is correctly defined
router.post('/auth/api/v1/login', authController.login);

module.exports = router;

>>>>>>> 7e4c6960ffba90835173ab9b4ac79ff7a50ea8d1
