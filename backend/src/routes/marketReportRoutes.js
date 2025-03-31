const express = require("express");
const router = express.Router();
const {
  getMarketReportData,
} = require("../controllers/marketReportController");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", protect, roleMiddleware(["admin"]), getMarketReportData);

module.exports = router;
