const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
  bookedAt: { type: Date, default: Date.now },
  cancelledAt: { type: Date }
});

// Method to cancel booking
bookingSchema.methods.cancel = async function() {
  if (this.status === "cancelled") {
    throw new Error("Booking is already cancelled");
  }
  
  this.status = "cancelled";
  this.cancelledAt = new Date();
  
  // Update event's remaining tickets
  const Event = mongoose.model('Event');
  const event = await Event.findById(this.event);
  event.remainingTickets += this.quantity;
  await event.save();
  
  await this.save();
};

module.exports = mongoose.model("Booking", bookingSchema);
