const missionService = require("../services/missionService");

const createMission = async (req, res) => {
  try {
    const { name, type, description, points } = req.body;
    const newMission = await missionService.createMission(
      name,
      type,
      description,
      points
    );

    // Emit a newMission event
    const io = req.app.get("io");
    io.emit("newMission", newMission);

    res.status(201).json(newMission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const completeMission = async (req, res) => {
  try {
    // Ensure that your authentication middleware sets req.user
    const userId = req.user.id;
    const missionId = req.params.id;
    const result = await missionService.completeMission(missionId, userId);

    // Get the Socket.IO instance
    const io = req.app.get("io");
    const eventData = { missionId, completer: result.user.name };
    console.log("Emitting missionCompleted event:", eventData);
    io.emit("missionCompleted", eventData);

    res.json({
      message: "Misión completada con éxito",
      user: result.user,
      mission: result.mission,
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


const uploadEvidence = async(req, res) =>{
  try {
    const { description, status } = req.body;
    const result = await missionService.createEvidenceWithFiles(description, status, req.files);
    res.json({ message: 'Evidencia y archivos subidos con éxito', ...result });
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





module.exports = {
  createMission,
  updateMission,
  deleteMission,
  getAllMissions,
  completeMission,
  uploadEvidence,
  getEvidences,
};
