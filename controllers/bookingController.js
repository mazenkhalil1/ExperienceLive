/*const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Book tickets
exports.bookTicket = async (req, res) => {
  const { event: eventId, quantity } = req.body;
  const event = await Event.findById(eventId);

  if (!event || event.status !== 'approved') {
    return res.status(404).json({ message: 'Event not available for booking' });
  }

  if (event.availableTickets < quantity) {
    return res.status(400).json({ message: 'Not enough tickets available' });
  }

  const totalPrice = quantity * event.price;

  const booking = await Booking.create({
    event: event._id,
    user: req.user._id,
    quantity,
    totalPrice
  });

  event.availableTickets -= quantity;
  await event.save();

  res.status(201).json(booking);
};

// View all bookings by logged-in user
exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('event');
  res.json(bookings);
};

// View single booking
exports.getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('event');

  if (!booking || !booking.user.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed to view this booking' });
  }

  res.json(booking);
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking || !booking.user.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed to cancel this booking' });
  }

  const event = await Event.findById(booking.event);
  event.availableTickets += booking.quantity;
  await event.save();

  await booking.remove();
  res.json({ message: 'Booking cancelled and tickets restored' });
};*/
