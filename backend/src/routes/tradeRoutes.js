const express = require("express");
const router = express.Router();
const {
  purchaseItem,
  getAvailablePointsForUser,
  getUserTrades,
} = require("../controllers/tradeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/purchase", protect, purchaseItem);
router.get("/available", protect, getAvailablePointsForUser);
router.get("/my", protect, getUserTrades);

module.exports = router;
