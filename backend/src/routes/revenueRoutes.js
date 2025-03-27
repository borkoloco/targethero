const express = require("express");
const router = express.Router();
const revenueController = require("../controllers/revenueController");
const { protect } = require("../middleware/authMiddleware");

router.post("/my", protect, revenueController.createRevenueRecord);
router.get("/my", protect, revenueController.getMyRevenue);
router.get("/", protect, revenueController.getRevenueByUser);
router.get("/approved",protect, revenueController.getRevenueApproved );
router.get("/pending", protect, revenueController.getRevenuePending);
router.put("/:id", protect, revenueController.updateRevenueRecord);
router.put("/:id/approved", protect,revenueController.approveRevenue);
router.delete("/:id", protect, revenueController.deleteRevenue);

module.exports = router;
