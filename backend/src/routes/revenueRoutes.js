const express = require("express");
const router = express.Router();
const revenueController = require("../controllers/revenueController");

router.post("/", revenueController.createRevenue);
router.put("/:id", revenueController.updateRevenue);
router.delete("/:id", revenueController.deleteRevenue);
router.get("/", revenueController.getAllRevenues);

module.exports = router;
