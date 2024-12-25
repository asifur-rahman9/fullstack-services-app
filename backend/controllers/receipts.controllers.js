const Receipt = require("../models/receipts.models");
const mongoose = require("mongoose");

const createReceipt = async (req, res) => {
  try {
    const newReceipt = new Receipt(req.body);
    console.log("Request Body:", req.body);
    await newReceipt.validate();
    await newReceipt.save();
    console.log("Receipt saved:", newReceipt);
    res.status(201).json({ success: true, data: newReceipt });
  } catch (err) {
    console.error("Error creating receipt:", err);
    res.status(500).json({ success: false, error: "Error creating receipt" });
  }
};

const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find();
    res.status(200).json({ success: true, data: receipts });
  } catch (err) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ success: false, error: "Error fetching receipts" });
  }
};

const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res
        .status(404)
        .json({ success: false, error: "Receipt not found" });
    }
    res.status(200).json({ success: true, data: receipt });
  } catch (err) {
    console.error("Error fetching receipt:", err);
    res.status(500).json({ success: false, error: "Error fetching receipt" });
  }
};

const updateReceipt = async (req, res) => {
  try {
    const updatedReceipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReceipt) {
      return res
        .status(404)
        .json({ success: false, error: "Receipt not found" });
    }
    res.status(200).json({ success: true, data: updatedReceipt });
  } catch (err) {
    console.error("Error updating receipt:", err);
    res.status(500).json({ success: false, error: "Error updating receipt" });
  }
};

const deleteReceipt = async (req, res) => {
  try {
    const deletedReceipt = await Receipt.findByIdAndDelete(req.params.id);
    if (!deletedReceipt) {
      return res
        .status(404)
        .json({ success: false, error: "Receipt not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Receipt deleted successfully" });
  } catch (err) {
    console.error("Error deleting receipt:", err);
    res.status(500).json({ success: false, error: "Error deleting receipt" });
  }
};

const getReceiptsByAdmin = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    console.log("THIS IS THE ADMIN ID,", adminID);
    const receipts = await Receipt.find({ adminID });
    console.log("Receipts fetched:", receipts);
    const unpaid = receipts.filter((r) => r.status === "unpaid");
    const paid = receipts.filter((r) => r.status === "paid");

    res.status(200).json({ success: true, data: { unpaid, paid } });
  } catch (err) {
    console.error("Error fetching receipts for admin:", err);
    res.status(500).json({ success: false, error: "Error fetching receipts" });
  }
};

const getReceiptsAmountByAdminID = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    const receipts = await Receipt.find({ adminID }).populate("adminID");

    if (!receipts.length) {
      return res
        .status(404)
        .json({ success: false, error: "No receipts found for the admin" });
    }

    res.status(200).json({ success: true, data: receipts });
  } catch (err) {
    console.error("Error fetching receipts for admin:", err);
    res.status(500).json({ success: false, error: "Error fetching receipts" });
  }
};

const getReceiptsByCustomer = async (req, res) => {
  try {
    const customerID = req.params.customerID;
    const receipts = await Receipt.find({ customerID });

    if (!receipts.length) {
      return res
        .status(404)
        .json({ success: false, error: "No receipts found for the client" });
    }

    res.status(200).json({ success: true, data: receipts });
  } catch (err) {
    console.error("Error fetching receipts for client:", err);
    res.status(500).json({ success: false, error: "Error fetching receipts" });
  }
};

const markReceiptAsPaid = async (req, res) => {
  try {
    const receiptID = req.params.id;
    const updatedReceipt = await Receipt.findByIdAndUpdate(
      receiptID,
      { status: "paid" },
      { new: true }
    );

    if (!updatedReceipt) {
      return res
        .status(404)
        .json({ success: false, error: "Receipt not found" });
    }

    res.status(200).json({ success: true, data: updatedReceipt });
  } catch (err) {
    console.error("Error marking receipt as paid:", err);
    res.status(500).json({ success: false, error: "Error updating receipt" });
  }
};

module.exports = {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
  getReceiptsByAdmin,
  getReceiptsByCustomer,
  markReceiptAsPaid,
  getReceiptsAmountByAdminID,
};
