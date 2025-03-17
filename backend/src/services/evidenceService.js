const Evidence = require("../models/Evidence");
const Mission = require("../models/Mission");

const createEvidence = async (missionId, userId, filePath, comment) => {
  const evidence = await Evidence.create({
    missionId,
    userId,
    filePath,
    comment,
    status: "pending",
  });

  const mission = await Mission.findByPk(missionId);
  if (mission) {
    mission.evidenceSubmitted = true;
    await mission.save();
  }

  return evidence;
};

const getPendingEvidenceByUser = async (userId) => {
  return await Evidence.findAll({
    where: {
      userId,
      status: "pending",
    },
    include: [
      {
        model: require("../models/Mission"),
        as: "mission",
        attributes: ["id", "name", "description", "points"],
      },
    ],
  });
};

module.exports = {
  createEvidence,
  getPendingEvidenceByUser,
};
