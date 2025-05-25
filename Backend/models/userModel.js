const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    profilePicture: {
      type: String, // You'll store the image URL or path
      default: ""   // or a default placeholder image path
    },
    role: {
      type: String,
      enum: ['user', 'organizer', 'admin'],
      default: 'user',
      required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    resetPasswordOTP: {
      type: String,
      select: false
    },
    resetPasswordOTPExpires: {
      type: Date,
      select: false
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