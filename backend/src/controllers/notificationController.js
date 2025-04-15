const Notification = require("../models/Notification");
const User = require("../models/User");
const notificationService = require("../services/notificationService");

const createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const createdBy = req.user.id;

    const notification = await notificationService.createNotification({
      title,
      message,
      createdBy,
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [{ model: User, as: "creator", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRecentNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin" || req.user.role === "hr";

    const notifications = await Notification.findAll({
      where: isAdmin
        ? {}
        : {
            [Op.or]: [{ recipient: "all" }, { recipient: userId }],
          },
      order: [["createdAt", "DESC"]],
      limit: 10,
      include: [{ model: User, as: "sender", attributes: ["name"] }],
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getRecentNotifications,
};
