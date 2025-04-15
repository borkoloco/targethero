const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BadgeEvidence = sequelize.define("BadgeEvidence", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  badgeRuleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
});

module.exports = BadgeEvidence;
