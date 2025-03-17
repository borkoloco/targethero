const missionService = require("../services/missionService");

const createMission = async (req, res) => {
  try {
    const { name, type, description, points, evidenceRequired } = req.body;
    const newMission = await missionService.createMission(
      name,
      type,
      description,
      points,
      evidenceRequired
    );

    const io = req.app.get("io");
    io.emit("newMission", newMission);

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
    const users = await missionService.getAllMissions();
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
    const missionIds = await missionService.getUserCompletedMissions(userId);
    res.json(missionIds);
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
