// src/routes/missionRoutes.js
const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");

router.post("/create", missionController.create);
router.put("/update/:id", missionController.update);
router.delete("/deleteMission/:id", missionController.deleteMission);
router.get("/getById/:id", missionController.getMissionById);
router.get("/all", missionController.getAll);
module.exports = router;
