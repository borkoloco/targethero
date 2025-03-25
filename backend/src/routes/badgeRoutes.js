const express = require("express");
const router = express.Router();
const badgeController = require("../controllers/badgeController");
const upload = require("../middleware/uploadMiddleware");

router.post("/", badgeController.createBadge);
router.post("/assign", badgeController.assignBadgeToUser);
router.put("/:id", badgeController.updateBadge);
router.put(
  "/upload/:id",
  upload.single("logo"),
  badgeController.updateBadgeWithImage
);
router.delete("/:id", badgeController.deleteBadge);
router.get("/", badgeController.getAllBadges);
router.get("/user", badgeController.getBadgesByUserId);
router.delete("/user/:userId/:badgeId", badgeController.unassignBadgeFromUser);
router.post("/upload-image", badgeController.uploadBadgeImage);

module.exports = router;
