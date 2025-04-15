const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const notificationController = require("../controllers/notificationController");

router.post(
  "/",
  protect,
  roleMiddleware(["hr"]),
  notificationController.createNotification
);

router.get("/", protect, notificationController.getAllNotifications);

router.get("/recent", protect, notificationController.getRecentNotifications);

module.exports = router;
