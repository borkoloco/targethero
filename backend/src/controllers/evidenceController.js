const evidenceService = require("../services/evidenceService");
const recentEventService = require("../services/recentEventService");
const Evidence = require("../models/Evidence");
const Mission = require("../models/Mission");
const User = require("../models/User");
const MissionCompletion = require("../models/MissionCompletion");
const cloudinary = require("cloudinary").v2;

const getPendingEvidence = async (req, res) => {
  try {
    const pendingEvidence = await Evidence.findAll({
      where: { status: "pending" },
      include: [
        {
          model: Mission,
          as: "mission",
          attributes: ["id", "name", "description"],
        },
        { model: User, as: "submitter", attributes: ["id", "name"] },
      ],
    });
    res.json(pendingEvidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveEvidence = async (req, res) => {
  try {
    const evidenceId = req.params.id;
    const evidence = await Evidence.findByPk(evidenceId);
    if (!evidence) throw new Error("Evidence not found");

    evidence.status = "approved";
    await evidence.save();

    const missionCompletion = await MissionCompletion.create({
      missionId: evidence.missionId,
      userId: evidence.userId,
    });

    const mission = await Mission.findByPk(evidence.missionId);
    const user = await User.findByPk(evidence.userId);
    if (mission && user) {
      user.points += mission.points;
      await user.save();

      const io = req.app.get("io");
      io.emit("missionCompleted", {
        missionId: evidence.missionId,
        userId: evidence.userId,
        completer: user.name,
      });

      const event = await recentEventService.addEvent(
        "mission",
        `${user.name} completed the mission "${mission.name}"`
      );

      io.emit("newEvent", event);
    }

    res.json({
      message: "Evidence approved and mission completion recorded",
      evidence,
      missionCompletion,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rejectEvidence = async (req, res) => {
  try {
    const evidenceId = req.params.id;
    const evidence = await Evidence.findByPk(evidenceId);
    if (!evidence) throw new Error("Evidence not found");

    evidence.status = "rejected";
    await evidence.save();

    const mission = await Mission.findByPk(evidence.missionId);
    if (mission) {
      mission.evidenceSubmitted = false;
      await mission.save();
    }

    res.json({ message: "Evidence rejected", evidence });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPendingEvidenceForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const evidences = await evidenceService.getPendingEvidenceByUser(userId);
    res.json(evidences);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const submitEvidence = async (req, res) => {
  try {
    const userId = req.user.id;
    const missionId = req.params.id;
    const comment = req.body.comment || "";

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "evidence",
    });

    const filePath = result.secure_url;

    const evidence = await evidenceService.createEvidence(
      missionId,
      userId,
      filePath,
      comment
    );

    res
      .status(201)
      .json({ message: "Evidence submitted successfully", evidence });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadEvidence = async (req, res) => {
  try {
    const fileUrl = req.file.path;

    res.status(201).json({ url: fileUrl });
  } catch (err) {
    console.error("Error uploading evidence:", err);
    res.status(500).json({ error: "Failed to upload evidence" });
  }
};

module.exports = {
  getPendingEvidence,
  approveEvidence,
  rejectEvidence,
  getPendingEvidenceForUser,
  submitEvidence,
  uploadEvidence,
};
