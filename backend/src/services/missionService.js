const { Op } = require("sequelize");
const Mission = require("../models/Mission");
const User = require("../models/User");
const Evidence = require("../models/Evidence");

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


const createEvidenceWithFiles = async (description, status, files) => {
  try {
     
      const evidence = await Evidence.create({ description, status });

      
      const filePaths = files.map(file => ({
          path: file.path,
          evidenceId: evidence.id
      }));

      await FilePath.bulkCreate(filePaths);

      return { evidence, files: filePaths };
  } catch (error) {
      throw new Error(`Error al crear la evidencia: ${error.message}`);
  }
};
  
const getAllEvidence = async()=>{
      try{
        return Evidence.findAll({
          include:[{model:FilePath, as: 'FilePaths'}]
        });
      } catch(error){
        throw new Error(`Error al obtener evidencias: ${error.message}`);
    
      }
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
};
