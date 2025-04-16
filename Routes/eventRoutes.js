const express = require('express');
const router = express.Router();
const { getAllEvents } = require('../controllers/eventController');
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authenticationmiddleware");
const authorize = require("../middleware/authorizationmiddleware");
router.get('/', getAllEvents); // Public
router.get('/', getAllEvents); // All events
router.get('/:id', getEventById);
router.put(
    "/events/:id",
    authMiddleware,
    authorize(["organizer", "admin"]),
    eventController.updateEvent
  );
  
module.exports = router;