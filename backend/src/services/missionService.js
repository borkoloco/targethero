const { Op } = require("sequelize");
const Mission = require("../models/Mission");



const getAllMission = async () => {
    return await Mission.findAll();
  };


const createMission = async (name, type, description, pionts, status) => {
    console.log("Datos recibidos para crear misión:", { name, type, description, pionts, status });
    const mission = await Mission.create(
        {
            name,
            type,
            description,
            pionts,
            status,

        })
    return mission

};

const updateMission = async (id, updateField) => {
  const mission = await Mission.findByPk(id);
  if (!mission) throw new Error("Misión no encontrada");

  return await mission.update(updateField);
};

const deleteMission = async (id) => {
  const mission = await Mission.findByPk(id);
  if (!mission) throw new Error("Misión no encontrada");
  await Mission.destroy({ where: { id } });
  return { message: "Misión eliminada correctamente" };
};

const getMissionByID = async (id) => {
  const mission = await Mission.findByPk(id);
  if (!mission) throw new Error("Misión no encontrada");
  return mission;
};

const getAllMissions = async () => {
  return await Mission.findAll();
};

module.exports = {

    createMission, updateMission, deleteMission , getMissionByID, getAllMission
}

