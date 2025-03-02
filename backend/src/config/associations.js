const User = require("../models/User");
const Mission = require("../models/Mission");

Mission.belongsTo(User, { foreignKey: "completedBy", as: "completer" });
User.hasMany(Mission, { foreignKey: "completedBy", as: "completedMissions" });
