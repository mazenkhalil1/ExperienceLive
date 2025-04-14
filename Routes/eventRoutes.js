const express = require('express');
const router = express.Router();
const { getAllEvents } = require('../controllers/eventController');

router.get('/', getAllEvents); // Public
router.get('/', getAllEvents); // All events
router.get('/:id', getEventById);
module.exports = router;