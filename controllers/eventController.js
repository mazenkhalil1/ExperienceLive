/*const Event = require('../models/Event');

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

module.exports = { getEventAnalytics };
const getEventById = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch event', error });
    }
  };
  
  module.exports = { getEventById }; */
  const eventModel = require("../models/eventModel");

exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      updates,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error" });
  }
};
