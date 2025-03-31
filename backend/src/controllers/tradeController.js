const { createTrade, getAvailablePoints } = require("../services/tradeService");
const Trade = require("../models/Trade");

const purchaseItem = async (req, res) => {
  const userId = req.user.id;
  const { item, cost } = req.body;
  try {
    const available = await getAvailablePoints(userId);
    if (available < cost) {
      return res.status(400).json({ error: "Insufficient available points" });
    }
    const trade = await createTrade(userId, item, cost);
    res.status(201).json({ message: "Purchase successful", trade });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAvailablePointsForUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const available = await getAvailablePoints(userId);
    res.json({ availablePoints: available });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserTrades = async (req, res) => {
  const userId = req.user.id;
  try {
    const trades = await Trade.findAll({ where: { userId } });
    res.json(trades);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { purchaseItem, getAvailablePointsForUser, getUserTrades };
