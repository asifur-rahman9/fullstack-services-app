const Appointment = require("../models/appointments.models");
const Service = require("../models/services.models");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("serviceID", "name description price category")
      .populate("adminID", "businessName email")
      .populate("customerID", "name email")
      .lean();
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res
      .status(500)
      .json({ success: false, error: "Error fetching appointments" });
  }
};

const getSingleAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(id)
      .populate("serviceID", "name description price category")
      .populate("adminID", "businessName email")
      .populate("customerID", "name email")
      .lean();

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, error: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res
      .status(500)
      .json({ success: false, error: "Error fetching appointment" });
  }
};

const createAppointment = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { serviceID, date, time, customerID } = req.body;

    if (!serviceID || !date || !time || !customerID) {
      console.error("Missing required fields:", {
        serviceID,
        date,
        time,
        customerID,
      });
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    if (!isValidObjectId(serviceID) || !isValidObjectId(customerID)) {
      console.error("Invalid ObjectId:", { serviceID, customerID });
      return res
        .status(400)
        .json({ success: false, error: "Invalid service or customer ID" });
    }

    console.log("Validations passed. Fetching service...");

    const service = await Service.findById(serviceID).lean();
    if (!service) {
      console.error("Service not found:", serviceID);
      return res
        .status(404)
        .json({ success: false, error: "Service not found" });
    }

    if (!service.adminID) {
      console.error("Admin ID missing in service:", service);
      return res
        .status(400)
        .json({ success: false, error: "Admin ID is missing for the service" });
    }

    console.log("Service found:", service);

    const newAppointment = new Appointment({
      serviceID: service._id,
      adminID: service.adminID,
      customerID: customerID,
      date,
      time,
      status: "pending",
    });

    console.log("Saving new appointment:", newAppointment);

    await newAppointment.save();
    console.log("Appointment created successfully:", newAppointment);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      data: newAppointment,
    });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res
      .status(500)
      .json({ success: false, error: "Error creating appointment" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("Received request to update appointment:");
    console.log("Appointment ID:", id);
    console.log("Updates requested:", updates);

    if (!isValidObjectId(id)) {
      console.error("Invalid appointment ID provided:", id);
      return res
        .status(400)
        .json({ success: false, error: "Invalid appointment ID" });
    }

    const allowedUpdates = ["date", "time", "status"];
    const isValidUpdate = Object.keys(updates).every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidUpdate) {
      console.error("Invalid fields in update request:", updates);
      return res
        .status(400)
        .json({ success: false, error: "Invalid fields in update request" });
    }

    if (updates.time && !/^\d{2}:\d{2}$/.test(updates.time)) {
      console.error("Invalid time format provided:", updates.time);
      return res
        .status(400)
        .json({ success: false, error: "Invalid time format" });
    }

    console.log("Attempting to update appointment with ID:", id);

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    )
      .populate("serviceID", "name description price category")
      .populate("adminID", "businessName email")
      .populate("customerID", "name email");

    if (!updatedAppointment) {
      console.error("Appointment not found for the given ID:", id);
      return res
        .status(404)
        .json({ success: false, error: "Appointment not found" });
    }

    console.log("Appointment updated successfully:", updatedAppointment);

    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res
      .status(500)
      .json({ success: false, error: "Error updating appointment" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid appointment ID" });
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res
        .status(404)
        .json({ success: false, error: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
      data: deletedAppointment,
    });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res
      .status(500)
      .json({ success: false, error: "Error deleting appointment" });
  }
};

const getAppointmentsByAdminID = async (req, res) => {
  try {
    const { adminID } = req.params;

    if (!isValidObjectId(adminID)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid admin ID" });
    }

    const appointments = await Appointment.find({ adminID })
      .populate("serviceID", "name description price category")
      .populate("customerID", "name email")
      .lean();

    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    console.error("Error fetching appointments by admin ID:", err);
    res
      .status(500)
      .json({ success: false, error: "Error fetching appointments" });
  }
};

const getAppointmentsByCustomerID = async (req, res) => {
  try {
    const { customerID } = req.params;

    if (!isValidObjectId(customerID)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid customer ID" });
    }

    const appointments = await Appointment.find({ customerID })
      .populate("serviceID", "name description price category")
      .populate("adminID", "businessName email")
      .populate("customerID", "name email")
      .lean();

    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    console.error("Error fetching appointments by customer ID:", err);
    res
      .status(500)
      .json({ success: false, error: "Error fetching appointments" });
  }
};

module.exports = {
  getAppointments,
  getSingleAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByAdminID,
  getAppointmentsByCustomerID,
};
