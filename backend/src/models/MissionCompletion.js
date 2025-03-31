const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MissionCompletion = sequelize.define("MissionCompletion", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = MissionCompletion;
