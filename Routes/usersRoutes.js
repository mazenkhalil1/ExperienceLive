const express = require('express');

//const { getEventAnalytics } = require('../controllers/eventController');
//const { verifyToken, verifyOrganizer } = require('../middleware/auth');

//router.get('/events/analytics', verifyToken, verifyOrganizer, getEventAnalytics);


const userController = require("../controllers/userController");
const authorizationMiddleware=require('../middleware/authorizationmiddleware');
const bookingController = require("../controllers/bookingController");
const eventController = require("../controllers/eventController");
const router = express.Router();

module.exports = router;

router.delete('/:id', protect, isAdmin, deleteUser);








//router.get('/', protect, authorizeRoles('admin'), userController.getAllUsers);