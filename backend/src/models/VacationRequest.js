const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VacationRequest = sequelize.define("VacationRequest", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "admin_approved", "approved", "rejected"),
    defaultValue: "pending",
  },
});

module.exports = VacationRequest;
