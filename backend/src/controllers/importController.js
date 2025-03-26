const importService = require("../services/importService");

const importMissions = async (req, res) => {
  try {
    const count = await importService.importMissions(req.file.buffer);
    res.status(200).json({ message: `Imported ${count} missions` });
  } catch (err) {
    console.error("Error importing missions:", err);
    res.status(500).json({ error: err.message });
  }
};

const importBadges = async (req, res) => {
  try {
    const count = await importService.importBadges(req.file.buffer);
    res.status(200).json({ message: `Imported ${count} badges` });
  } catch (err) {
    console.error("Error importing badges:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  importMissions,
  importBadges,
};
