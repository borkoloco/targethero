const insigniasService = require("../services/badgeService");

const createBadge = async (req, res) => {
  try {
    const { name, logoUrl, type, description } = req.body;
    const newInsignia = await badgeService.createBadge(
      name,
      logoUrl,
      type,
      description
    );

    res.status(201).json(newBadge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateBadge = async (req, res) => {
  try {
    const updatedBadge = await badgeService.updateBadge(
      req.params.id,
      req.body
    );
    res.json(updatedBadge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBadge = async (req, res) => {
  try {
    const result = await badgeService.deleteBadge(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllBadges = async (req, res) => {
  try {
    const badge = await badgeService.getAllBadges();
    res.json(badge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBadgeByID = async (req, res) => {
  try {
    const badge = await badgeService.getBadgeByID();
    res.json(badge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBadge,
  updateBadge,
  deleteBadge,
  getAllBadges,
  getBadgeByID,
};
