const express = require('express');
const router = express.Router();
const { getAllEvents } = require('../controllers/eventController');

router.get('/', getAllEvents); // Public
router.get('/', getAllEvents); // All events
router.get('/:id', getEventById);
router.delete('/:id', protect, deleteEvent);
router.post('/', protect, createEvent);

module.exports = router;