const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PayReceipt = sequelize.define("PayReceipt", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  signatureUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  signatureStatus: {
    type: DataTypes.ENUM(
      "unsigned",
      "awaiting_admin_approval",
      "awaiting_approval",
      "approved"
    ),
    defaultValue: "unsigned",
  },
});

module.exports = PayReceipt;
