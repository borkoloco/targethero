const express = require("express");
const router = express.Router();
const revenueController = require("../controllers/revenueController");
const { protect } = require("../middleware/authMiddleware");

router.post("/my", protect, revenueController.createRevenueRecord);
router.get("/my", protect, revenueController.getMyRevenue);
router.get("/", protect, revenueController.getRevenueByUser);
router.put("/:id", protect, revenueController.updateRevenueRecord);

module.exports = router;
