const Notification = require("../models/Notification");
const User = require("../models/User");

const createNotification = async ({ title, message, createdBy }) => {
  return await Notification.create({ title, message, createdBy });
};

const getAllNotifications = async () => {
  return await Notification.findAll({
    include: [
      { model: User, as: "creator", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  createNotification,
  getAllNotifications,
};
