const BadgeEvidence = require("../models/BadgeEvidence");
const BadgeRule = require("../models/BadgeRule");
const Badge = require("../models/Badge");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const submitBadgeEvidence = async (req, res) => {
  try {
    const { badgeRuleId, comment } = req.body;
    const userId = req.user.id;

    if (!req.file) throw new Error("No file uploaded");

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "evidence",
    });

    const evidence = await BadgeEvidence.create({
      badgeRuleId,
      userId,
      fileUrl: result.secure_url,
      comment,
      status: "pending",
    });

    res.status(201).json(evidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPendingBadgeEvidence = async (req, res) => {
  try {
    const evidenceList = await BadgeEvidence.findAll({
      where: { status: "pending" },
      include: [
        {
          model: BadgeRule,
          as: "badgeRule",
          include: [{ model: Badge, as: "badge" }],
        },
      ],
    });
    res.json(evidenceList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveBadgeEvidence = async (req, res) => {
  try {
    const evidence = await BadgeEvidence.findByPk(req.params.id, {
      include: [BadgeRule, User],
    });
    if (!evidence) throw new Error("Evidence not found");

    evidence.status = "approved";
    await evidence.save();

    await evidence.user.addBadge(evidence.badgeRule.badgeId);

    res.json({ message: "Evidence approved and badge assigned", evidence });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rejectBadgeEvidence = async (req, res) => {
  try {
    const evidence = await BadgeEvidence.findByPk(req.params.id);
    if (!evidence) throw new Error("Evidence not found");

    evidence.status = "rejected";
    await evidence.save();

    res.json({ message: "Evidence rejected", evidence });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMyBadgeEvidence = async (req, res) => {
  try {
    const userId = req.user.id;
    const evidence = await BadgeEvidence.findAll({
      where: { userId },
    });
    res.json(evidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  submitBadgeEvidence,
  getPendingBadgeEvidence,
  approveBadgeEvidence,
  rejectBadgeEvidence,
  getMyBadgeEvidence,
};
