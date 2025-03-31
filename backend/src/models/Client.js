const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true },
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "prospect", "active", "inactive"),
    defaultValue: "pending",
  },
  requestedStatus: {
    type: DataTypes.ENUM("prospect", "active", "inactive"),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Users",
      key: "id",
    },
  },
  });

module.exports = Client;
