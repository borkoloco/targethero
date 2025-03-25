const User = require("../models/User");
const Mission = require("../models/Mission");

const getDashboardMetrics = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "points"],
    });

    const totalMissions = await Mission.count();
    const completedMissions = await Mission.count({
      where: { isCompleted: true },
    });
    const missionCompletionRate =
      totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

    const goal = 2000000000;
    const totalBilling = 1000000000;
    const billingProgress = (totalBilling / goal) * 100;

    res.json({
      missionCompletionRate,
      billingProgress,
      users,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getDashboardMetrics };
