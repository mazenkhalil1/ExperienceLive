const Event = require("../models/event");
const Booking = require("../models/Booking");

// Create new event
exports.createEvent = async (req, res, next) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user.id,
      status: "pending"
    });

    await event.save();
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// Get all events
exports.getEvents = async (req, res, next) => {
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
    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
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
    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
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
    const events = await Event.find({ organizer: req.user.id });

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
