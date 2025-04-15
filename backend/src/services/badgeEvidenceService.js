const BadgeEvidence = require("../models/BadgeEvidence");

const createEvidence = async (badgeRuleId, userId, fileUrl, comment) => {
  return await BadgeEvidence.create({
    badgeRuleId,
    userId,
    fileUrl,
    comment,
    status: "pending",
  });
};

const getPendingEvidence = async () => {
  return await BadgeEvidence.findAll({ where: { status: "pending" } });
};

const updateEvidenceStatus = async (id, status) => {
  const evidence = await BadgeEvidence.findByPk(id);
  if (!evidence) throw new Error("Evidence not found");
  evidence.status = status;
  await evidence.save();
  return evidence;
};

const getEvidenceByUser = async (userId) => {
  return await BadgeEvidence.findAll({ where: { userId } });
};

module.exports = {
  createEvidence,
  getPendingEvidence,
  updateEvidenceStatus,
  getEvidenceByUser,
};
