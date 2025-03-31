const User = require("../models/User");
const Mission = require("../models/Mission");
const MissionCompletion = require("../models/MissionCompletion");

const getDashboardMetrics = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "points"],
    });

    const totalMissions = await Mission.count();

    const uniqueCompletedMissions = await MissionCompletion.count({
      distinct: true,
      col: "missionId",
    });

    const totalCompletions = await MissionCompletion.count();

    const goal = 2000000000;
    const totalBilling = 1000000000;
    const billingProgress = (totalBilling / goal) * 100;

    res.json({
      missionCompletionRate:
        totalMissions > 0 ? (uniqueCompletedMissions / totalMissions) * 100 : 0,
      averageCompletionsPerMission:
        totalMissions > 0 ? totalCompletions / totalMissions : 0,
      billingProgress,
      users,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getDashboardMetrics };
