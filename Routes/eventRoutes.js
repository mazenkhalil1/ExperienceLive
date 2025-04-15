const express = require('express');
const router = express.Router();
const { getAllEvents } = require('../controllers/eventController');
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authenticationMiddleware");
const authorize = require("../middleware/authorizationmiddleware");
router.get('/', getAllEvents); // Public
router.get('/', getAllEvents); // All events
router.get('/:id', getEventById);
<<<<<<< HEAD
router.delete('/:id', protect, deleteEvent);
router.post('/', protect, createEvent);

=======
router.put(
    "/events/:id",
    authMiddleware,
    authorize(["organizer", "admin"]),
    eventController.updateEvent
  );
  
>>>>>>> a96492aa2bcb265e924ed45771bd298ad7c25e84
module.exports = router;