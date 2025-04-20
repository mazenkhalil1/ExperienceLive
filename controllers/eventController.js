const Event = require("../models/event");
const Booking = require("../models/Booking");
const User = require("../models/userModel");
const mongoose = require('mongoose');

// Create new event
exports.createEvent = async (req, res, next) => {
  try {
    console.log('=== Create Event Start ===');
    console.log('Request headers:', req.headers);
    console.log('Request user:', req.user);
    console.log('Request body:', req.body);

    // Check authentication
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Create event data
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      price: req.body.price,
      totalTickets: req.body.totalTickets,
      category: req.body.category,
      image: req.body.image,
      organizer: req.user.userId // This will be converted to ObjectId by Mongoose
    };

    console.log('Event data to save:', eventData);

    // Create and save event
    const event = new Event(eventData);
    const savedEvent = await event.save();

    console.log('Saved event:', savedEvent);
    console.log('=== Create Event End ===');

    return res.status(201).json({
      success: true,
      data: savedEvent
    });
  } catch (err) {
    console.error('Create event error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating event",
      error: err.message
    });
  }
};

// Get all events (Public - only approved events)
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: "approved" })
      .populate("organizer", "name email")
      .sort("-date");

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
};

// Get all events (Admin - all events)
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email")
      .sort("-date");

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
};

// Get single event
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // For public access, only show approved events
    if (!req.user || req.user.role !== 'admin') {
      if (event.status !== 'approved') {
        return res.status(404).json({
          success: false,
          message: "Event not found"
        });
      }
    }

    res.json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// Update event
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event"
      });
    }

    // Only allow updating specific fields
    const allowedUpdates = ["title", "description", "date", "location", "price", "totalTickets", "category", "image"];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// Delete event
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event"
      });
    }

    await event.remove();
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// Get event analytics
exports.getEventAnalytics = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.userId });

    // Update analytics for each event
    for (let event of events) {
      await event.updateAnalytics();
    }

    res.json({
      success: true,
      data: events.map(event => ({
        id: event._id,
        title: event.title,
        analytics: event.analytics
      }))
    });
  } catch (err) {
    next(err);
  }
};

// Approve/Reject event (Admin only)
exports.updateEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    event.status = status;
    await event.save();

    res.json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};
