const badgeService = require("../services/badgeService");
const recentEventService = require("../services/recentEventService");
const cloudinary = require("../config/cloudinary");

const createBadge = async (req, res) => {
  try {
    const { name, logoUrl, type, description } = req.body;
    const newBadge = await badgeService.createBadge(
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
    const badgeId = req.params.id;
    const { name, type, description, logoUrl } = req.body;

    const updated = await badgeService.updateBadge(badgeId, {
      name,
      type,
      description,
      logoUrl,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating badge:", err);
    res.status(500).json({ error: err.message });
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

const assignBadgeToUser = async (req, res) => {
  console.log("BODY RECIBIDO EN CONTROLLER:", req.body);

  const { userId, badgeId } = req.body;

  if (!userId || !badgeId) {
    return res.status(400).json({ error: "userId and badgeId are required" });
  }

  try {
    const result = await badgeService.assignBadgeToUser(userId, badgeId);
    await recentEventService.addEvent(
      "badge",
      `Badge ID ${badgeId} assigned to user ID ${userId}`,
      req.app.get("io")
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("Error assigning badge:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBadgesByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;
    const badges = await badgeService.getBadgesByUserId(userId);
    res.json(badges);
  } catch (err) {
    console.error("Error in getBadgesByUserId:", err);
    res.status(500).json({ error: err.message });
  }
};

const unassignBadgeFromUser = async (req, res) => {
  try {
    const { userId, badgeId } = req.params;
    const result = await badgeService.unassignBadgeFromUser(userId, badgeId);
    res.json(result);
  } catch (err) {
    console.error("Error unassigning badge:", err);
    res.status(500).json({ error: err.message });
  }
};

const uploadBadgeImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "badges",
      resource_type: "image",
    });

    res.json({ url: uploadResult.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

const updateBadgeWithImage = async (req, res) => {
  try {
    const badgeId = req.params.id;
    const { name, type, description } = req.body;
    const file = req.file;

    const updated = await badgeService.updateBadgeWithImage(badgeId, {
      name,
      type,
      description,
      file,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating badge with image:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBadge,
  updateBadge,
  deleteBadge,
  getAllBadges,
  getBadgeByID,
  assignBadgeToUser,
  unassignBadgeFromUser,
  getBadgesByUserId,
  updateBadgeWithImage,
  uploadBadgeImage,
};
