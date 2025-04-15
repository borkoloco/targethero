const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BadgeRule = sequelize.define("BadgeRule", {
  conditionType: {
    type: DataTypes.ENUM(
      "missions_completed",
      "total_revenue",
      "total_points",
      "clients_obtained",
      "evidence_required"
    ),
    allowNull: false,
  },
  conditionValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  threshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  badgeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = BadgeRule;
