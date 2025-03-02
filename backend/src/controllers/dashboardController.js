const User = require("../models/User");
const Mission = require("../models/Mission");

const getDashboardMetrics = async (req, res) => {
  try {
    // 1. Total points per user (assuming each User has a points field)
    const users = await User.findAll({
      attributes: ["id", "name", "points"],
    });

    // 2. Mission completion rate: count missions completed vs. assigned.
    // Assuming Mission model has a boolean field `isCompleted`.
    const totalMissions = await Mission.count();
    const completedMissions = await Mission.count({
      where: { isCompleted: true },
    });
    const missionCompletionRate =
      totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

    // 3. Financial progress: For now, let's set a dummy value.
    const goal = 2000000000;
    // Assume you calculate total billing somewhere (dummy value below)
    const totalBilling = 1000000000;
    const billingProgress = (totalBilling / goal) * 100;

    // Now, send the response with these metrics
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
