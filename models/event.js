const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  remainingTickets: { type: Number, required: true },
  status: { type: String, enum: ["approved", "pending", "declined"], default: "pending" },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String },
  image: { type: String },
  analytics: {
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    bookingPercentage: { type: Number, default: 0 }
  }
});

// Method to update analytics
eventSchema.methods.updateAnalytics = async function() {
  const Booking = mongoose.model('Booking');
  const bookings = await Booking.find({ event: this._id });
  
  this.analytics.totalBookings = bookings.length;
  this.analytics.totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  this.analytics.bookingPercentage = (this.totalTickets - this.remainingTickets) / this.totalTickets * 100;
  
  await this.save();
};

module.exports = mongoose.model("Event", eventSchema);
