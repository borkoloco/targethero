const { Op } = require("sequelize");
const Mission = require("../models/Mission");
const { name } = require("../models/User");


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


const updateMission = async (id,updateField)=>{
    const mission = await Mission.findByPk(id);
    if (!mission) throw new Error("Mision no encontrada");
    return await Mission.update(updateField)
};

const deleteMission = async(id)=>{
    const mission = await Mission.findByPk(id);
    if (!mission) throw new Error("Mision no encontrada");
    await Mission.destroy();
    return { message : ("Mision eliminada Correctamente")}

}

const getMissionByID = async(id) =>{
    const mission = await Mission.findByPk(id);
    if (!mission) throw new Error("Mision no encontrada");
    return await mission;

}

module.exports = {
    createMission, updateMission, deleteMission , getMissionByID, getAllMission
}
