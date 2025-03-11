const {DataTypes} =require("sequelize");
const sequelize = require("../config/db");

const User = require("../models/User")


const Revenue = sequelize.define("Revenue",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId:{
        
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: "id",
        },
        onDelete: "CASCADE", 
          

    },
    total:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,


    },
    date:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

})

User.hasMany(Revenue, { foreignKey: "userId" });
Revenue.belongsTo(User, { foreignKey: "userId" });



module.exports = Revenue;