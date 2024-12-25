const Service = require("../models/services.models");
const mongoose = require("mongoose");

const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate({
      path: "adminID",
      select: "businessName",
    });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ success: false, error: "Error fetching services" });
  }
};

const getServicesByAdminID = async (req, res) => {
  try {
    const { adminID } = req.params;
    const services = await Service.find({
      adminID: new mongoose.Types.ObjectId(adminID),
    });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ success: false, error: "Error fetching services" });
  }
};

const getSingleService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, error: "Service not found" });
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    console.error("Error fetching service:", err);
    res.status(500).json({ success: false, error: "Error fetching service" });
  }
};

const createService = async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json({ success: true, data: newService });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ success: false, error: "Error creating service" });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedService) {
      return res
        .status(404)
        .json({ success: false, error: "Service not found" });
    }
    res.status(200).json({ success: true, data: updatedService });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ success: false, error: "Error updating service" });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res
        .status(404)
        .json({ success: false, error: "Service not found" });
    }
    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: deletedService,
    });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ success: false, error: "Error deleting service" });
  }
};

module.exports = {
  getServices,
  getSingleService,
  createService,
  updateService,
  deleteService,
  getServicesByAdminID,
};
