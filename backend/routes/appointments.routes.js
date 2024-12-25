const express = require("express");
const router = express.Router();
const {
  getAppointments,
  getSingleAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByAdminID,
  getAppointmentsByCustomerID,
} = require("../controllers/appointments.controllers");

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/:id", getSingleAppointment);
router.patch("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.get("/admin/:adminID", getAppointmentsByAdminID);
router.get("/customer/:customerID", getAppointmentsByCustomerID);

module.exports = router;
