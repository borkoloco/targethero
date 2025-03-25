const express = require("express");
const router = express.Router();
const evidenceController = require("../controllers/evidenceController");
const { protect } = require("../middleware/authMiddleware");
const upload2 = require("../middleware/uploadMiddleware");
const upload = require("../middleware/evidenceUpload");

router.post(
  "/upload",
  protect,
  upload.single("file"),
  evidenceController.uploadEvidence
);
router.post(
  "/:id",
  protect,
  upload2.single("evidence"),
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
