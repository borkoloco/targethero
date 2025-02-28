
const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");


router.post("/", missionController.create);
router.put("/update", missionController.update);
router.delete("/deleteMission", missionController.deleteMission);
router.get("/", missionController.getAllMission);

module.exports = router;

