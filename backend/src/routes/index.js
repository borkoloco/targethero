const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const rankingRoutes = require("./rankingRoutes");
const missionRoutes = require("./missionRoutes");
const revenueRoutes = require("./revenueRoutes");
const clientRoutes = require("./clientRoutes");
const evidenceRoutes = require("./evidenceRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/missions", missionRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/ranking", rankingRoutes);
router.use("/revenue", revenueRoutes);
router.use("/clients", clientRoutes);
router.use("/evidence", evidenceRoutes);

module.exports = router;
