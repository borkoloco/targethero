const express = require("express");
const router = express.Router();
const evidenceController = require("../controllers/evidenceController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/:id",
  protect,
  upload.single("evidence"),
  evidenceController.submitEvidence
);
router.get(
  "/pending/:userId",
  protect,
  evidenceController.getPendingEvidenceForUser
);
router.get("/pending", protect, evidenceController.getPendingEvidence);
router.post("/:id/approve", protect, evidenceController.approveEvidence);
router.post("/:id/reject", protect, evidenceController.rejectEvidence);

module.exports = router;
