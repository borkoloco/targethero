const User = require("../models/User");
const RoomReservation = require("../models/RoomReservation");


const requestRoomReservation = async (req, res) => {
  try {
    const { roomNumber, start_time, end_time } = req.body;
    const userId = req.user.id;
    

    const reservation = await RoomReservation.create({
      userId,
      roomNumber,
      start_time,
      end_time,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las reservas (admin)
const getAllRoomReservations = async (req, res) => {
  try {
    const reservations = await RoomReservation.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirmar reserva
const confirmRoomReservation = async (req, res) => {
  try {
    const reservation = await RoomReservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: "Not found" });

    reservation.status = "confirmed";
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancelar reserva
const cancelRoomReservation = async (req, res) => {
  try {
    const reservation = await RoomReservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: "Not found" });

    reservation.status = "cancelled";
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener mis reservas
const getMyRoomReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await RoomReservation.findAll({
      where: { userId },
    });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  requestRoomReservation,
  getAllRoomReservations,
  confirmRoomReservation,
  cancelRoomReservation,
  getMyRoomReservations,
};
