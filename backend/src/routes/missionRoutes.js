const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", missionController.createMission);
router.put("/:id", missionController.updateMission);
router.delete("/:id", missionController.deleteMission);
router.get("/", missionController.getAllMissions);
router.post("/complete/:id", protect, missionController.completeMission);

module.exports = router;
