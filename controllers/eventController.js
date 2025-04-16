const Event = require('../models/Event');

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, totalTickets, price } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      totalTickets,
      remainingTickets: totalTickets,
      price,
      organizer: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error });
  }
};

// Get one event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, { new: true });

    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (String(event.organizer) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Analytics for organizer's events
const getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });

    const analytics = events.map(event => {
      const booked = event.totalTickets - event.remainingTickets;
      const percentBooked = ((booked / event.totalTickets) * 100).toFixed(2);
      return {
        title: event.title,
        percentBooked: percentBooked + '%',
        totalTickets: event.totalTickets,
        booked
      };
    });

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Analytics fetch failed', error });
  }
};

// Get all approved events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

module.exports = {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  getAllEvents
};
