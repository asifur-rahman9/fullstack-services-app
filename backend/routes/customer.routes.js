const express = require("express");
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
  logoutCustomer,
} = require("../controllers/customer.controllers");

const router = express.Router();

router.post("/", createCustomer);
router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.patch("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/login", loginCustomer);
router.patch("/:id/logout", logoutCustomer);

router.all("*", (req, res) => {
  console.log(`Received ${req.method} request at ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
