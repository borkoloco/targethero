const express = require("express");
const router = express.Router();
const badgeEvidenceController = require("../controllers/badgeEvidenceController");
const upload = require("../middleware/evidenceUpload");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  protect,
  upload.single("evidence"),
  badgeEvidenceController.submitBadgeEvidence
);
router.get(
  "/pending",
  protect,
  roleMiddleware(["admin"]),
  badgeEvidenceController.getPendingBadgeEvidence
);
router.put(
  "/:id/approve",
  protect,
  roleMiddleware(["admin"]),
  badgeEvidenceController.approveBadgeEvidence
);
router.put(
  "/:id/reject",
  protect,
  roleMiddleware(["admin"]),
  badgeEvidenceController.rejectBadgeEvidence
);

router.get("/my", protect, badgeEvidenceController.getMyBadgeEvidence);

module.exports = router;
