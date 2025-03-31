const Trade = require("../models/Trade");
const User = require("../models/User");

async function getAvailablePoints(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const totalEarned = user.points;
  const spentPoints = (await Trade.sum("points", { where: { userId } })) || 0;
  return totalEarned - spentPoints;
}

async function createTrade(userId, item, cost) {
  const available = await getAvailablePoints(userId);
  if (available < cost) throw new Error("Insufficient available points");

  const trade = await Trade.create({ userId, points: cost, item });
  return trade;
}

module.exports = { getAvailablePoints, createTrade };
