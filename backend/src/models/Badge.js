const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Badges = sequelize.define("Badge", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logoUrl: {
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
});

module.exports = Badges;
