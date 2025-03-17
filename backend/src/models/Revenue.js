const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Revenue = sequelize.define("RevenueRecord", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Revenue;
