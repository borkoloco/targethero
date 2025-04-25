const express = require("express");
const router = express.Router();
const roomReservationController = require("../controllers/roomReservationController");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.get("/my-reservations", protect, roomReservationController.getMyRoomReservations);

router.post("/request", protect, roomReservationController.requestRoomReservation);


router.get(
  "/all",
  protect,
  roleMiddleware(["hr", "admin"]),
  roomReservationController.getAllRoomReservations
);


router.put(
  "/:id/confirm",
  protect,
  roleMiddleware(["hr"]),
  roomReservationController.confirmRoomReservation
);


router.put(
  "/:id/cancel",
  protect,
  roleMiddleware(["hr"]),
  roomReservationController.cancelRoomReservation
);

module.exports = router;
