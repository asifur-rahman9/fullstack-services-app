const mongoose = require("mongoose");

const connectDatabase = async (connectionString) => {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

module.exports = connectDatabase;
