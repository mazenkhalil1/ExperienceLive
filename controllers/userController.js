const User = require("../models/userModel");
const Booking = require("../models/Booking");
const Event = require("../models/event");

// Get all users (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// Get single user (Admin only)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Get current user's profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Update current user's profile
const bcrypt = require("bcrypt");
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      profilePicture: req.body.profilePicture
    };

    if(req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    console.log('Attempting to update user role for ID:', req.params.id);
    const { role } = req.body;

    if (!["user", "organizer", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    console.log('Attempting to delete user with ID:', req.params.id);
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Standard user: View all own bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate('event');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Organizer: View own posted events
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.userId });

    const enhancedEvents = await Promise.all(events.map(async (event) => {
      // Get total bookings for this event
      const bookings = await Booking.find({ event: event._id });

      const totalBookings = bookings.reduce((acc, b) => acc + b.quantity, 0);
      const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

      const bookingPercentage = event.totalTickets > 0
        ? (((event.totalTickets - event.remainingTickets) / event.totalTickets) * 100).toFixed(2)
        : "0";

      return {
        ...event.toObject(),
        analytics: {
          totalBookings,
          totalRevenue,
          bookingPercentage: bookingPercentage + "%"
        }
      };
    }));

    res.json(enhancedEvents);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch organizer events with analytics",
      error: err.message
    });
  }
};

// Organizer: View analytics on booked tickets
// This function calculates the percentage of tickets booked for each event created by the organizer
exports.getEventAnalytics = async (req, res) => {
  const events = await Event.find({ organizer: req.user.userId });
  const analytics = events.map(e => ({
    title: e.title,
    percentBooked: ((e.totalTickets - e.remainingTickets) / e.totalTickets * 100).toFixed(2) + "%"
  }));
  res.json(analytics);
};