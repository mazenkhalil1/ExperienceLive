const express = require('express');
const router = express.Router();
const { getEventAnalytics } = require('../controllers/eventController');
const { verifyToken, verifyOrganizer } = require('../middleware/auth');

router.get('/events/analytics', verifyToken, verifyOrganizer, getEventAnalytics);

module.exports = router;
