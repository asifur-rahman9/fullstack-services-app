const Customer = require("../models/customer.models");
const mongoose = require("mongoose");

const createCustomer = async (req, res) => {
  try {
    console.log("Creating customer:", req.body);
    const newCustomer = await Customer.create(req.body);
    res.status(201).json({ success: true, data: newCustomer });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ success: false, error: "Error creating Customer" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customers.",
      error: error.message,
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }
    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customer.",
      error: error.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update customer.",
      error: error.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete customer.",
      error: error.message,
    });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "Customer account not found!" });
    }

    if (customer.password !== password || customer.accountType !== "customer") {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    customer.loggedIn = true;
    await customer.save();

    res.json({
      message: "Login successful!",
      id: customer._id,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutCustomer = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(req.body);

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Customer ID is required" });
    }

    console.log("Customer ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Customer ID format" });
    }

    const customer = await Customer.findById(id);
    console.log(customer);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }

    if (!customer.loggedIn) {
      return res
        .status(400)
        .json({ success: false, error: "Customer is already logged out" });
    }

    customer.loggedIn = false;
    await customer.save();

    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ success: false, error: "Error updating customer" });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
  logoutCustomer,
};
