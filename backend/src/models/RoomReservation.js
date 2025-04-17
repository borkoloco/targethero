const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const RoomReservation = sequelize.define("RoomReservation",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roomNumber: {
        type: DataTypes.ENUM("1", "2", "3", "4"),
        defaultValue: "1",
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reservedBy: {
        type: DataTypes.INTEGER, 
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
});

module.exports = RoomReservation;