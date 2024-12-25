const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Please provide a date for the appointment"],
  },
  time: {
    type: String,
    required: [true, "Please provide a time for the appointment"],
    trim: true,
  },
  serviceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: [true, "Please provide a service ID"],
  },
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: [true, "Please provide an admin ID"],
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Please provide a customer ID"],
  },
  status: {
    type: String,
    enum: ["completed", "ongoing", "pending", "cancelled"],
    default: "pending",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
