const RoomReservationService = require("../services/roomReservationService");


const createReservation = async (req, res) => {
    try {
      const { roomNumber, start_time, end_time, reservedBy } = req.body;
  
    
      const cancelApprovedReservations = async (roomNumber) => {
        const approvedReservations = await Reservation.findAll({
          where: {
            status: "approved",
            roomNumber,
          },
        });
  
        for (const reservation of approvedReservations) {
          reservation.status = "cancelled";
          await reservation.save();
        }
      };
  
      
     
  
      await cancelApprovedReservations(roomNumber);
  
      const expiresAt = end_time;
  
      const newReservation = await RoomReservationService.createReservation({
        roomNumber,
        start_time,
        end_time,
        reservedBy,
        status: "approved",
        expiresAt
      });
  
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const updateReservation= async (req, res) => {
  try {
    const updatedReservation = await RoomReservationService.updateReservation(
      req.params.id,
      req.body
    );
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteReservation= async (req, res) => {
  try {
    const result = await RoomReservationService.deleteReservation(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllReservations= async (req, res) => {
  try {
    const users = await RoomReservationService.getAllReservations({ includeExpired: true });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {createReservation,
    updateReservation,
    deleteReservation,
    getAllReservations,
}