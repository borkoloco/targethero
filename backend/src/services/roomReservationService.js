const RoomReservation = require("../models/RoomReservation");
const User = require("../models/User");


const createReservation = async(userName,roomNumber,start_time,end_time) => {
    const reservation= await RoomReservation.create({
        userName,
        roomNumber,
        start_time,
        end_time,
        status: "pending", 
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
    return await RoomReservation.findAll({
      include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });
  };

  module.exports  ={
    createReservation,
    updateReservation,
    deleteReservation,
    getAllReservations,
  }
  