const { Op } = require("sequelize");
const Mission = require("../models/Mission");
const User = require("../models/User");

const createMission = async (name, type, description, points) => {
  console.log("Datos recibidos para crear misión:", {
    name,
    type,
    description,
    points,
  });
  const mission = await Mission.create({
    name,
    type,
    description,
    points,
  });
  return mission;
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
  return await Mission.findAll({
    include: [
      {
        model: require("../models/User"),
        as: "completer",
        attributes: ["id", "name"],
      },
    ],
  });
};

const completeMission = async (missionId, userId) => {
  const mission = await Mission.findByPk(missionId);
  if (!mission) throw new Error("Misión no encontrada");

  const user = await User.findByPk(userId);
  if (!user) throw new Error("Usuario no encontrado");

  mission.isCompleted = true;
  mission.completedBy = userId;
  await mission.save();

  user.points += mission.points;
  await user.save();

  return { mission, user };
};

module.exports = {
  createMission,
  updateMission,
  deleteMission,
  getMissionByID,
  getAllMissions,
  completeMission,
};
