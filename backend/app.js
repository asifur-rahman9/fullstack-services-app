const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDatabase = require("./database/connect");
const serviceRoutes = require("./routes/services.routes");
const adminRoutes = require("./routes/admin.routes");
const customerRoutes = require("./routes/customer.routes");
const receiptRoutes = require("./routes/receipts.routes");
const appointmentRoutes = require("./routes/appointments.routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const connectionString = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// Routes
app.use("/api/services", serviceRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/receipts", receiptRoutes);

app.get("/", (req, res) => {
  res.send("Service Manager Backend is running!");
});

const startServer = async () => {
  try {
    await connectDatabase(connectionString);
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to connect to the database", err);
  }
};

startServer();
