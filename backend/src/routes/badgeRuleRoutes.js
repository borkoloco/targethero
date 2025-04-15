const express = require("express");
const router = express.Router();
const badgeRuleController = require("../controllers/badgeRuleController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, badgeRuleController.createBadgeRule);
router.get("/", protect, badgeRuleController.getBadgeRules);

module.exports = router;
