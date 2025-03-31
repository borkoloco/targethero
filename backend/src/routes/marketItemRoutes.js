const express = require("express");
const router = express.Router();
const marketItemController = require("../controllers/marketItemController");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/evidenceUpload");

router.post(
  "/market-image",
  protect,
  roleMiddleware(["admin"]),
  upload.single("evidence"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const secureUrl = req.file.path || req.file.secure_url;
    res.json({ secure_url: secureUrl });
  }
);

router.post(
  "/",
  protect,
  roleMiddleware(["admin"]),
  marketItemController.createItem
);
router.put(
  "/:id",
  protect,
  roleMiddleware(["admin"]),
  marketItemController.updateItem
);
router.delete(
  "/:id",
  protect,
  roleMiddleware(["admin"]),
  marketItemController.deleteItem
);
router.get("/", protect, marketItemController.getItems);

module.exports = router;
