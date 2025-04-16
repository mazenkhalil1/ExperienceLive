const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  totalTickets: Number,
  remainingTickets: Number,
  price: Number,
  status: {
    type: String,
    enum: ['approved', 'pending', 'declined'],
    default: 'pending'
  },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Event', eventSchema);