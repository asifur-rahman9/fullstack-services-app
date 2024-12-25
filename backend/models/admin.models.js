const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Please provide your business name"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    accountType: {
      type: String,
      default: "admin",
      immutable: true,
      required: true,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
