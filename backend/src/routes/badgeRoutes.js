const express = require("express");
const router = express.Router();
const badgeController = require("../controllers/badgeController");

router.post("/", badgeController.createBadge);
router.put("/", badgeController.updateBadge);
router.delete("/:id", badgeController.deleteBadge);
router.get("/", badgeController.getAllBadges);

module.exports = router;
