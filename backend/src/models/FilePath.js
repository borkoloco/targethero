const{DataTypes} = require("sequelize");
const sequelize = require("../config/db");


const FilePath = sequelize.define('FilePath', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    evidenceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Evidence',
            key: 'id'
        }
    }
});

module.exports = FilePath;