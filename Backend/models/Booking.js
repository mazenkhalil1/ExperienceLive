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
  console.log('Executing bookingSchema.methods.cancel for booking ID:', this._id);
  if (this.status === "cancelled") {
    console.log('Booking already cancelled:', this._id);
    throw new Error("Booking is already cancelled");
  }
  
  this.status = "cancelled";
  this.cancelledAt = new Date();
  console.log('Booking status updated to cancelled:', this._id);
  
  // Update event's remaining tickets
  const Event = mongoose.model('Event');
  const event = await Event.findById(this.event);

  if (!event) {
    console.warn(`Associated event with ID ${this.event} not found for booking ${this._id}. Cannot update remaining tickets.`);
  } else {
    console.log('Event remaining tickets before update:', event.remainingTickets);
    event.remainingTickets += this.quantity;
    console.log('Event remaining tickets after update:', event.remainingTickets);
    await event.save();
    console.log('Event saved after ticket update.');
  }
  
  await this.save();
  console.log('Booking saved after cancellation.');
};

module.exports = mongoose.model("Booking", bookingSchema);
