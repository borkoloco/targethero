const { Op } = require("sequelize");
const Insignias = require("../models/Insignias");


const createInsignia = async(name,logoUrl,type,description)=>{
    const Insignia = await Insignias.create({
        name,logoUrl,type,description,
    })
    return Insignia;
}

const updateInsignia = async (id, updateField) => {
    const insignia = await Insignias.findByPk(id);
    if (!insignia) throw new Error("insignia no encontrada");
  
    return await insignia.update(updateField);
};

const deleteInsignia = async (id) => {
    const insignia = await Insignias.findByPk(id);
    if (!insignia) throw new Error("Misión no encontrada");
    await Insignias.destroy({ where: { id } });
    return { message: "Insignia eliminada correctamente" };
};

const getInsiniaByID= async (id) => {
    const insignia = await Insignias.findByPk(id);
    if (!insignia) throw new Error("Insignia no encontrada");
    return insignia;
};

const getAllUsers = async () => {
    return await User.findAll();
  };
  
  

module.exports = {
    createInsignia,
    updateInsignia,
    deleteInsignia,
    getInsiniaByID,
    getAllUsers,
};