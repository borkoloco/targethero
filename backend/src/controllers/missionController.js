const missionService = require("../services/missionService");
const recentEventService = require("../services/recentEventService");

const createMission = async (req, res) => {
  try {
    const { name, type, description, points, evidenceRequired } = req.body;

    const getExpirationDate = (type) => {
      const now = new Date();
      switch (type) {
        case "diaria":
        case "aleatoria":
          return new Date(now.setHours(23, 59, 59, 999));
        case "mensual":
          return new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
          );
        case "trimestral":
          const quarterEndMonth = Math.floor(now.getMonth() / 3 + 1) * 3;
          return new Date(
            now.getFullYear(),
            quarterEndMonth,
            0,
            23,
            59,
            59,
            999
          );
        default:
          return null;
      }
    };

    const expiresAt = getExpirationDate(type);

    const newMission = await missionService.createMission(
      name,
      type,
      description,
      points,
      evidenceRequired,
      expiresAt
    );

    const io = req.app.get("io");
    io.emit("newMission", newMission);

    await recentEventService.addEvent(
      "mission",
      `New mission created: ${newMission.name}`,
      io
    );

    res.status(201).json(newMission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const completeMission = async (req, res) => {
  try {
    const userId = req.user.id;
    const missionId = req.params.id;
    const result = await missionService.completeMission(missionId, userId);

    const io = req.app.get("io");
    io.emit("missionCompleted", {
      missionId,
      userId,
      completer: result.user.name,
    });

    const event = await recentEventService.addEvent(
      "mission",
      `${result.user.name} completed the mission "${result.mission.name}"`
    );
    io.emit("newEvent", event);

    res.json({
      message: "Misión completada con éxito",
      mission: result.mission,
      user: result.user,
      missionCompletion: result.missionCompletion,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMission = async (req, res) => {
  try {
    const updatedMission = await missionService.updateMission(
      req.params.id,
      req.body
    );
    res.json(updatedMission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMission = async (req, res) => {
  try {
    const result = await missionService.deleteMission(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllMissions = async (req, res) => {
  try {
    const users = await missionService.getAllMissions({ includeExpired: true });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadEvidence = async (req, res) => {
  try {
    const { description, status } = req.body;
    const result = await missionService.createEvidenceWithFiles(
      description,
      status,
      req.files
    );
    res.json({ message: "Evidencia y archivos subidos con éxito", ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEvidences = async (req, res) => {
  try {
    const evidences = await missionService.getAllEvidence();
    res.json(evidences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserCompletedMissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const completions = await missionService.getUserCompletedMissions(userId);
    res.json(completions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createMission,
  updateMission,
  deleteMission,
  getAllMissions,
  completeMission,
  uploadEvidence,
  getEvidences,
  getUserCompletedMissions,
};
