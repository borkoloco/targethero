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
const badgeRoutes = require("./badgeRoutes");
const recentEventRoutes = require("./recentEventRoutes");
const importRoutes = require("./importRoutes");
const marketItemRoutes = require("./marketItemRoutes");
const marketReportRoutes = require("./marketReportRoutes");
const tradeRoutes = require("./tradeRoutes");
const badgeRulesRoutes = require("./badgeRuleRoutes");
const badgeEvidenceRoutes = require("./badgeEvidenceRoutes");
const vacationRoutes = require("./vacationRoutes");
const payReceiptRoutes = require("./payReceiptRoutes");
const notificationRoutes = require("./notificationRoutes");
const hrRoutes = require("./hrRoutes");
const roomResRoutes = require("./roomResRoutes");

router.use("/trades", tradeRoutes);
router.use("/market", marketItemRoutes);
router.use("/market-report", marketReportRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/missions", missionRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/ranking", rankingRoutes);
router.use("/revenue", revenueRoutes);
router.use("/clients", clientRoutes);
router.use("/evidence", evidenceRoutes);
router.use("/badges", badgeRoutes);
router.use("/events", recentEventRoutes);
router.use("/import", importRoutes);
router.use("/badge-rules", badgeRulesRoutes);
router.use("/badge-evidence", badgeEvidenceRoutes);
router.use("/vacations", vacationRoutes);
router.use("/pay-receipts", payReceiptRoutes);
router.use("/notifications", notificationRoutes);
router.use("/hr-stats", hrRoutes);
router.use("room-reservation",roomResRoutes);

module.exports = router;
