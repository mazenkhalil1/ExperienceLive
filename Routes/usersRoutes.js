const express = require('express');

//const { getEventAnalytics } = require('../controllers/eventController');
//const { verifyToken, verifyOrganizer } = require('../middleware/auth');

//router.get('/events/analytics', verifyToken, verifyOrganizer, getEventAnalytics);


const userController = require("../controllers/userController");
const authorizationMiddleware=require('../middleware/authorizationmiddleware');
const authMiddleware = require("../middleware/authenticationmiddleware");
const bookingController = require("../controllers/bookingController");
const eventController = require("../controllers/eventController");
const router = express.Router();
router.put(
    "/users/:id",
    authMiddleware,
    authorize(["admin"]),
    userController.updateUserRole
  );

module.exports = router;







//router.get('/', protect, authorizeRoles('admin'), userController.getAllUsers);