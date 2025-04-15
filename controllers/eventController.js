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


  const deleteEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
  
    // Only the organizer or an admin can delete
    if (String(event.organizer) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
  
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  };
1  

const createEvent = async (req, res) => {
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
};
