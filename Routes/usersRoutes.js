const express = require("express");
const userController = require("../controllers/userController");
const authorizationMiddleware=require('../middleware/authorizationmiddleware');
const bookingController = require("../controllers/bookingController");
const eventController = require("../controllers/eventController");

const router = express.Router();


router.get('/', protect, authorizeRoles('admin'), userController.getAllUsers);