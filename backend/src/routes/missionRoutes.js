const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController")

router.post("/create", missionController.create);
router.put("/update", missionController.update);
router.delete("/deleteMission", missionController.deleteMission);
router.get("/getById", missionController.getMissionById);

module.exports = router;