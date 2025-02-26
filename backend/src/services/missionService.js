const { Op } = require("sequelize");
const Mission = require("../models/Mission");
const { name } = require("../models/User");



const createMission = async (name, type, description, pionts) => {
    console.log("Datos recibidos para crear misión:", { name, type, description, pionts });
    const mission = await Mission.create(
        {
            name,
            type,
            description,
            pionts,

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
    createMission, updateMission, deleteMission , getMissionByID
}
