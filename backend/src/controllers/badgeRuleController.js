const BadgeRule = require("../models/BadgeRule");
const badgeRuleService = require("../services/badgeRuleService");

const createBadgeRule = async (req, res) => {
  try {
    const rule = await BadgeRule.create(req.body);
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getBadgeRules = async (req, res) => {
  try {
    const rules = await BadgeRule.findAll({ include: "badge" });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const evaluateAndAssignBadges = async (userId) => {
  await badgeRuleService.evaluateAndAssignBadges(userId);
};

module.exports = {
  createBadgeRule,
  getBadgeRules,
  evaluateAndAssignBadges,
};
