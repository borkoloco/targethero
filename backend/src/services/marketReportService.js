const User = require("../models/User");
const Trade = require("../models/Trade");

async function getMarketReport() {
  const users = await User.findAll();
  const report = await Promise.all(
    users.map(async (user) => {
      const trades = await Trade.findAll({ where: { userId: user.id } });
      const totalSpent = trades.reduce((sum, trade) => sum + trade.points, 0);
      const availablePoints = user.points - totalSpent;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        totalPoints: user.points,
        availablePoints,
        trades,
      };
    })
  );
  return report;
}

module.exports = { getMarketReport };
