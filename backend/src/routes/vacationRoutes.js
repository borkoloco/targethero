const express = require("express");
const router = express.Router();
const vacationController = require("../controllers/vacationController");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/my-requests", protect, vacationController.getMyVacationRequests);

router.post("/request", protect, vacationController.requestVacation);
router.get(
  "/all",
  protect,
  roleMiddleware(["hr", "admin"]),
  vacationController.getAllRequests
);
router.put(
  "/:id/approve",
  protect,
  roleMiddleware(["hr"]),
  vacationController.approveRequest
);
router.put(
  "/:id/reject",
  protect,
  roleMiddleware(["hr"]),
  vacationController.rejectRequest
);

router.get(
  "/approved",
  protect,
  roleMiddleware(["hr"]),
  vacationController.getApprovedRequests
);

router.put(
  "/:id/admin-approve",
  protect,
  roleMiddleware(["admin"]),
  vacationController.approveByAdmin
);

module.exports = router;
