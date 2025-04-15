const express = require("express");
const router = express.Router();
const receiptUpload = require("../middleware/receiptUpload");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const payReceiptController = require("../controllers/payReceiptController");

router.post(
  "/upload",
  protect,
  roleMiddleware(["hr"]),
  receiptUpload.single("receipts"),
  payReceiptController.uploadPayReceipt
);

router.get("/my-receipts", protect, payReceiptController.getReceiptsByUser);

router.get(
  "/month/:month",
  protect,
  roleMiddleware(["hr"]),
  payReceiptController.getReceiptsForMonth
);

router.get(
  "/signed",
  protect,
  roleMiddleware(["hr"]),
  payReceiptController.getSignedReceipts
);

router.get(
  "/sent",
  protect,
  roleMiddleware(["hr", "admin"]),
  payReceiptController.getUploadedReceipts
);

router.put(
  "/:id/sign",
  protect,
  roleMiddleware(["user"]),
  payReceiptController.signPayReceipt
);

router.put(
  "/:id/approve-signature",
  protect,
  roleMiddleware(["hr"]),
  payReceiptController.approveSignature
);

router.put(
  "/:id/admin-approve",
  protect,
  roleMiddleware(["admin"]),
  payReceiptController.approveByAdmin
);

module.exports = router;
