const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  category: String,
  image: String,
  price: Number,

  totalTickets: Number,
  remainingTickets: Number,

  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending"
  },

  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Your original field
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For admin/ownership control
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);
