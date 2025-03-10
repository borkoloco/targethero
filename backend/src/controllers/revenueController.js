const revenueService = require("../services/revenueService");

const createRevenue = async (req, res) => {
  try {
    const { userId, total, date } = req.body;

    if (!userId || !total) {
      return res.status(400).json({ error: "userId y total son obligatorios" });
    }

    const newRevenue = await revenueService.createRevenue({
      userId,
      total,
      date: date || new Date(), 
    });

    res.status(201).json(newRevenue);
  } catch (error) {
    console.error("Error en createRevenue:", error);
    res.status(500).json({ error: "Error al crear revenue" });
  }
};

const updateRevenue = async (req, res) => {
  try {
    const updatedRevenue = await revenueService.updateRevenue(
      req.params.id,
      req.body
    );
    res.json(updatedRevenue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRevenue = async (req, res) => {
  try {
    const result = await revenueService.deleteRevenue(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllRevenues = async (req, res) => {
  try {
    const revenue = await revenueService.getAllRevenues();
    res.json(revenue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports ={
    createRevenue,
    updateRevenue,
    deleteRevenue,
    getAllRevenues
};


