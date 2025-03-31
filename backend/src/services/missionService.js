const { Op } = require("sequelize");
const Mission = require("../models/Mission");
const User = require("../models/User");
const Evidence = require("../models/Evidence");
const MissionCompletion = require("../models/MissionCompletion");

const createMission = async (
  name,
  type,
  description,
  points,
  evidenceRequired,
  expiresAt
) => {
  const mission = await Mission.create({
    name,
    type,
    description,
    points,
    evidenceRequired,
    expiresAt,
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
        as: "completers",
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    ],
  });
};

const completeMission = async (missionId, userId) => {
  const mission = await Mission.findByPk(missionId);
  if (!mission) throw new Error("Misión no encontrada");

  const user = await User.findByPk(userId);
  if (!user) throw new Error("Usuario no encontrado");

  const existingCompletion = await MissionCompletion.findOne({
    where: { missionId, userId },
  });
  if (existingCompletion) {
    throw new Error("Misión ya completada por el usuario");
  }

  const missionCompletion = await MissionCompletion.create({
    missionId,
    userId,
  });

  user.points += mission.points;
  await user.save();

  return { mission, user, missionCompletion };
};

const createEvidenceWithFiles = async (description, status, files) => {
  try {
    const evidence = await Evidence.create({ description, status });

    const filePaths = files.map((file) => ({
      path: file.path,
      evidenceId: evidence.id,
    }));

    await FilePath.bulkCreate(filePaths);

    return { evidence, files: filePaths };
  } catch (error) {
    throw new Error(`Error al crear la evidencia: ${error.message}`);
  }
};

const getAllEvidence = async () => {
  try {
    return Evidence.findAll({
      include: [{ model: FilePath, as: "FilePaths" }],
    });
  } catch (error) {
    throw new Error(`Error al obtener evidencias: ${error.message}`);
  }
};

const getUserCompletedMissions = async (userId) => {
  const completions = await MissionCompletion.findAll({
    where: { userId },
    include: [
      {
        model: Mission,
        as: "mission",
      },
    ],
  });

  return completions
    .filter((comp) => {
      const mission = comp.mission;
      return (
        mission &&
        (!mission.expiresAt ||
          new Date(comp.completedAt) <= new Date(mission.expiresAt))
      );
    })
    .map((comp) => comp.mission);
};

module.exports = {
  createMission,
  updateMission,
  deleteMission,
  getMissionByID,
  getAllMissions,
  completeMission,
  createEvidenceWithFiles,
  getAllEvidence,
  getUserCompletedMissions,
};
