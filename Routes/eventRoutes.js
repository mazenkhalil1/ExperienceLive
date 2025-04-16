const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middleware/authenticationMiddleware');
const { authorize } = require('../middleware/authorizationmiddleware');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Organizer/Admin routes
router.post('/', protect, authorize(['organizer']), createEvent);
router.put('/:id', protect, authorize(['organizer', 'admin']), updateEvent);
router.delete('/:id', protect, authorize(['organizer', 'admin']), deleteEvent);

module.exports = router;