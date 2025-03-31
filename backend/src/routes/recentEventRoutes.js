const express = require("express");
const router = express.Router();
const recentEventController = require("../controllers/recentEventController");

router.get("/recent", recentEventController.getRecentEvents);

module.exports = router;
