const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a service name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a service description"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide a price for the service"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category for the service"],
    trim: true,
  },
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: [true, "Please provide a business ID"],
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
