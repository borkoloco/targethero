const User = require("../models/User");
const BadgeRule = require("../models/BadgeRule");
const UserBadge = require("../models/UserBadge");

const evaluateAndAssignBadges = async (userId) => {
  const user = await User.findByPk(userId, {
    include: ["missions", "clients", "revenues", "evidence"],
  });

  const rules = await BadgeRule.findAll();

  for (const rule of rules) {
    let meetsCondition = false;

    switch (rule.conditionType) {
      case "missions_completed": {
        const count =
          user.missions?.filter((m) => m.type === rule.conditionValue).length ||
          0;
        meetsCondition = count >= rule.threshold;
        break;
      }
      case "total_revenue": {
        const totalRevenue =
          user.revenues?.reduce((sum, r) => sum + r.amount, 0) || 0;
        meetsCondition = totalRevenue >= rule.threshold;
        break;
      }
      case "total_points": {
        meetsCondition = user.points >= rule.threshold;
        break;
      }
      case "clients_obtained": {
        meetsCondition = user.clients?.length >= rule.threshold;
        break;
      }
      case "evidence_required": {
        meetsCondition = user.evidence?.some(
          (e) => e.missionId === parseInt(rule.conditionValue)
        );
        break;
      }
    }

    if (meetsCondition) {
      const hasBadge = await UserBadge.findOne({
        where: { userId, badgeId: rule.badgeId },
      });
      if (!hasBadge) {
        await UserBadge.create({ userId, badgeId: rule.badgeId });
      }
    }
  }
};

module.exports = {
  evaluateAndAssignBadges,
};
