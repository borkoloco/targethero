const User = require("../models/User");
const Badge = require("../models/Badge");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const createBadge = async (name, logoUrl, type, description) => {
  const newBadge = await Badge.create({
    name,
    logoUrl,
    type,
    description,
  });
  return newBadge;
};

const updateBadge = async (id, updateFields) => {
  const badge = await Badge.findByPk(id);
  if (!badge) throw new Error("Badge not found");

  return await badge.update(updateFields);
};

const deleteBadge = async (id) => {
  const badge = await Badge.findByPk(id);
  if (!badge) throw new Error("Insignia no encontrada");
  await badge.destroy({ where: { id } });
  return { message: "Insignia eliminada correctamente" };
};

const getBadgeByID = async (id) => {
  const badge = await Badge.findByPk(id);
  if (!badge) throw new Error("Insignia no encontrada");
  return badge;
};

const getAllBadges = async () => {
  return await Badge.findAll();
};

const assignBadgeToUser = async (userId, badgeId) => {
  const badge = await Badge.findByPk(badgeId);
  const user = await User.findByPk(userId);

  if (!badge || !user) {
    throw new Error("User or Badge not found");
  }

  await user.addUserBadge(badge);
  return { message: "Badge assigned successfully" };
};

const getBadgesByUserId = async (userId) => {
  if (!userId) throw new Error("Missing userId");

  const user = await User.findByPk(userId, {
    include: {
      model: Badge,
      as: "userBadges",
      through: { attributes: [] },
    },
  });

  if (!user) throw new Error("User not found");

  return user.userBadges;
};

const unassignBadgeFromUser = async (userId, badgeId) => {
  const user = await User.findByPk(userId);
  const badge = await Badge.findByPk(badgeId);

  if (!user || !badge) {
    throw new Error("User or Badge not found");
  }

  await user.removeUserBadge(badge);
  return { message: "Badge unassigned successfully" };
};

const updateBadgeWithImage = async (
  id,
  { name, type, description, logoUrl }
) => {
  const badge = await Badge.findByPk(id);
  if (!badge) throw new Error("Badge not found");
  return await badge.update({ name, type, description, logoUrl });
};
// const updateBadgeWithImage = async (id, { name, type, description, file }) => {
//   const badge = await Badge.findByPk(id);
//   if (!badge) throw new Error("Badge not found");

//   let logoUrl = badge.logoUrl;

//   if (file) {
//     const upload = await cloudinary.uploader.upload(file.path, {
//       folder: "badges",
//     });
//     logoUrl = upload.secure_url;
//   }

//   return await badge.update({ name, type, description, logoUrl });
// };

module.exports = {
  createBadge,
  updateBadge,
  deleteBadge,
  getBadgeByID,
  getAllBadges,
  assignBadgeToUser,
  unassignBadgeFromUser,
  getBadgesByUserId,
  updateBadgeWithImage,
};
