const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Mission = sequelize.define("Mission", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  points: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Mission;
