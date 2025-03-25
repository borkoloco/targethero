const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserBadge = sequelize.define("UserBadge", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  badgeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = UserBadge;
