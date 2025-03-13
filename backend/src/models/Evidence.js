const{DataTypes} = require("sequelize");
const sequelize = require("../config/db");
const FilePath = require('./FilePath');


const Evidence = sequelize.define("Evidence",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
      description:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'aproved','denied'),
        allowNull: false,
        defaultValue: 'pending'
    },
});

// Relación con FilePath
Evidence.hasMany(FilePath, { foreignKey: 'evidenceId', as: 'filePaths' });
FilePath.belongsTo(Evidence, { foreignKey: 'evidenceId' });

module.exports = Evidence;