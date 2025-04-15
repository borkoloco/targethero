const User = require("../models/User");
const Mission = require("../models/Mission");
const Client = require("../models/Client");
const Evidence = require("../models/Evidence");
const Revenue = require("../models/Revenue");
const MissionCompletion = require("../models/MissionCompletion");
const Badge = require("../models/Badge");
const BadgeRule = require("../models/BadgeRule");
const BadgeEvidence = require("../models/BadgeEvidence");
const PayReceipt = require("../models/PayReceipt");
const VacationRequest = require("../models/VacationRequest");
const Notification = require("../models/Notification");

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

User.belongsToMany(Badge, {
  through: "UserBadges",
  as: "userBadges",
  foreignKey: "userId",
});
Badge.belongsToMany(User, {
  through: "UserBadges",
  as: "users",
  foreignKey: "badgeId",
});

MissionCompletion.belongsTo(Mission, {
  foreignKey: "missionId",
  as: "mission",
});

BadgeRule.belongsTo(Badge, { foreignKey: "badgeId", as: "badge" });

BadgeEvidence.belongsTo(BadgeRule, {
  foreignKey: "badgeRuleId",
  as: "badgeRule",
});

BadgeRule.hasMany(BadgeEvidence, {
  foreignKey: "badgeRuleId",
  as: "evidences",
});

User.hasMany(PayReceipt, { foreignKey: "userId", as: "receipts" });
PayReceipt.belongsTo(User, { foreignKey: "userId", as: "employee" });

User.hasMany(VacationRequest, {
  foreignKey: "userId",
  as: "vacationRequests",
});

VacationRequest.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Notification.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
User.hasMany(Notification, { foreignKey: "createdBy", as: "notifications" });
