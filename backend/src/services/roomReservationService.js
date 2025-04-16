const RoomReservation = require("../models/RoomReservation");
const User = require("../models/User");


const createReservation = async(
    roomNumber,
    start_time,
    end_time,
    reservedBy,
) => {
    const reservation= await RoomReservation.create({
        roomNumber,
        start_time,
        end_time,
        reservedBy,
        status: "pending", 
        expiresAt,
    })
    return reservation;
};



const updateReservation = async (id, updateField) => {
    const reservation = await RoomReservation.findByPk(id);
    if (!reservation) throw new Error("Reservation no encontrada");
  
    return await reservation.update(updateField);
};


const deleteReservation = async (id) => {
    const reservation = await RoomReservation.findByPk(id);
    if (!reservation) throw new Error("Reservation no encontrada");
    await reservation.destroy({ where: { id } });
    return { message: "Reservation eliminada correctamente" };
  };


  const getAllReservations = async () => {
    const allReservations = await reservation.findAll({
      include: [
        {
          model: User,  
          as: "users",   
        }
      ]
    });
  
    return allReservations.map((reservation) => {
      const userName = reservation.user ? reservation.user.name : "Desconocido"; 
      return {
        ...reservation.toJSON(),
        reservedBy: `reservada por ${userName}`,  
      };
    });
  };


  module.exports  ={
    createReservation,
    updateReservation,
    deleteReservation,
    getAllReservations,
  }
  