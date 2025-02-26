const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const missionRoutes = require("./missionRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/missions", missionRoutes);

module.exports = router;
