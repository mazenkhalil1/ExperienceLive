const express = require('express');
const {
  bookTicket,
  getMyBookings,
  cancelBooking,
  getBookingById
} = require('../controllers/bookingController');

const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Standard users only
router.post('/', authenticate, authorize('user'), bookTicket);
router.get('/', authenticate, authorize('user'), getMyBookings);
router.get('/:id', authenticate, authorize('user'), getBookingById);
router.delete('/:id', authenticate, authorize('user'), cancelBooking);

module.exports = router;
