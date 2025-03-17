const User = require("../models/User");
const Mission = require("../models/Mission");
const Client = require("../models/Client");
const Evidence = require("../models/Evidence");
const Revenue = require("../models/Revenue");
const MissionCompletion = require("../models/MissionCompletion");

Client.belongsTo(User, { foreignKey: "assignedTo", as: "manager" });
User.hasMany(Client, { foreignKey: "assignedTo", as: "clients" });

Evidence.belongsTo(Mission, {
  foreignKey: "missionId",
  as: "mission",
  onDelete: "CASCADE",
  hooks: true,
});
Evidence.belongsTo(User, { foreignKey: "userId", as: "submitter" });

User.hasMany(Revenue, { foreignKey: "userId", as: "revenues" });
Revenue.belongsTo(User, { foreignKey: "userId", as: "user" });

User.belongsToMany(Mission, {
  through: MissionCompletion,
  as: "completedMissions",
  foreignKey: "userId",
});
Mission.belongsToMany(User, {
  through: MissionCompletion,
  as: "completers",
  foreignKey: "missionId",
});
