const express = require("express");
const router = express.Router();
const { getHRMetrics } = require("../controllers/hrController");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/metrics", protect, roleMiddleware(["hr"]), getHRMetrics);

module.exports = router;
