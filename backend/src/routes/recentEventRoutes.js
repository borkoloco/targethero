const express = require("express");
const router = express.Router();
const recentEventController = require("../controllers/recentEventController");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/recent", recentEventController.getRecentEvents);
router.post(
  "/recent",
  protect,
  roleMiddleware(["hr", "admin"]),
  recentEventController.postRecentEvent
);

module.exports = router;
