const express = require("express");
const {
  getServices,
  getSingleService,
  createService,
  updateService,
  deleteService,
  getServicesByAdminID,
} = require("../controllers/services.controllers");

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getSingleService);
router.post("/", createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);
router.get("/admin/:adminID", getServicesByAdminID);

module.exports = router;
