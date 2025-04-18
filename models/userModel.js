const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      minLength: 3,
      maxLength: 30,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'organizer', 'admin'],
      default: 'user',
      required: true
    },
    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }],
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema); 