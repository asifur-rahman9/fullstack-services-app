const Admin = require("../models/admin.models");
const mongoose = require("mongoose");

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, data: admins });
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ success: false, error: "Error fetching admins" });
  }
};

const getSingleAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).json({ success: false, error: "Error fetching admin" });
  }
};

const createAdmin = async (req, res) => {
  try {
    const newAdmin = await Admin.create(req.body);
    res.status(201).json({ success: true, data: newAdmin });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ success: false, error: "Error creating admin" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAdmin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }
    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).json({ success: false, error: "Error updating admin" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }
    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
      data: deletedAdmin,
    });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ success: false, error: "Error deleting admin" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin account not found!" });
    }

    if (admin.password !== password || admin.accountType !== "admin") {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    admin.loggedIn = true;
    await admin.save();

    res.json({
      message: "Login successful!",
      id: admin._id,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Admin ID is required" });
    }

    console.log("Admin ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Admin ID format" });
    }

    const admin = await Admin.findById(id);
    console.log(admin);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    if (!admin.loggedIn) {
      return res
        .status(400)
        .json({ success: false, error: "Admin is already logged out" });
    }

    admin.loggedIn = false;
    await admin.save();

    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ success: false, error: "Error updating admin" });
  }
};

module.exports = {
  getAdmins,
  getSingleAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
};
