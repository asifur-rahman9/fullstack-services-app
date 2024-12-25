const express = require("express");
const router = express.Router();
const {
  getAdmins,
  getSingleAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/admin.controllers");

router.get("/", getAdmins);
router.get("/:id", getSingleAdmin);
router.post("/", createAdmin);
router.patch("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.post("/login", loginAdmin);
router.patch("/:id/logout", logoutAdmin);

module.exports = router;
