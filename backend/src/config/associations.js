const User = require("../models/User");
const Mission = require("../models/Mission");
const Client = require("../models/Client");

Mission.belongsTo(User, { foreignKey: "completedBy", as: "completer" });
User.hasMany(Mission, { foreignKey: "completedBy", as: "completedMissions" });

Client.belongsTo(User, { foreignKey: "assignedTo", as: "manager" });
User.hasMany(Client, { foreignKey: "assignedTo", as: "clients" });
