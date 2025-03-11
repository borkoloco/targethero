const Revenue = require("../models/Revenue");

const getAllRevenues = async() =>{
    return await Revenue.findAll();
};

const createRevenue = async({userId,total,date}) =>{
    const revenue = await Revenue.create({
        userId,
        total,
        date,
    });

    return revenue;


};

const updateRevenue = async (id, updateField) => {
    const revenue = await Revenue.findByPk(id);
    if (!revenue) throw new Error("Facturacion no encontrada");
  
    return await revenue.update(updateField);
  };


  const deleteRevenue = async (id) => {
    const revenue = await Revenue.findByPk(id);
    if (!revenue) throw new Error("Facturacion no encontrada");
    await revenue.destroy();
    return { message: "Facturacion eliminada correctamente" };
  };


module.exports = {
    getAllRevenues,
    createRevenue,
    updateRevenue,
    deleteRevenue

};