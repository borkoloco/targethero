const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RecentEvent = sequelize.define(
  "RecentEvent",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("mission", "badge"),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = RecentEvent;
