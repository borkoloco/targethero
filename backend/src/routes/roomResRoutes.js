const express = require("express");
const router = express.Router();
const roomReservationController = require("../controllers/roomReservationController");


router.post("/",roomReservationController.createReservation);
router.put("/:id",roomReservationController.updateReservation);
router.delete("/:id",roomReservationController.deleteReservation);
router.get("/",roomReservationController.getAllReservations);

module.exports  = router;
