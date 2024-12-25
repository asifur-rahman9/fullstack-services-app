const express = require("express");
const {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
  getReceiptsByAdmin,
  getReceiptsByCustomer,
  markReceiptAsPaid,
  getReceiptsAmountByAdminID,
} = require("../controllers/receipts.controllers");

const router = express.Router();

router.post("/", createReceipt);
router.get("/", getAllReceipts);
router.get("/:id", getReceiptById);
router.patch("/:id", updateReceipt);
router.delete("/:id", deleteReceipt);
router.get("/admin/:adminID", getReceiptsByAdmin);
router.get("/customer/:customerID", getReceiptsByCustomer);
router.patch("/:id/mark-as-paid", markReceiptAsPaid);
router.get("/adminDashboard/:adminID", getReceiptsAmountByAdminID);

module.exports = router;
