const missionService = require("../services/missionService");

const create = async (req, res) => {
  try {
    const { name, type, description, points } = req.body;
    const newMission = await missionService.createMission(
      name,
      type,
      description,
      points
    );
    res.status(201).json(newMission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
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

const getMissionById = async (req, res) => {
  try {
    const mission = await missionService.getMissionByID(req.params.id);
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const missions = await missionService.getAllMissions();
    res.json(missions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  create,
  update,
  deleteMission,
  getMissionById,
  getAll,
};
