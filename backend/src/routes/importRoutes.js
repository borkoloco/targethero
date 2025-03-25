const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const importController = require("../controllers/importController");

router.post("/badges", upload.single("file"), importController.importBadges);
router.post(
  "/missions",
  upload.single("file"),
  importController.importMissions
);

module.exports = router;
