const { Op } = require("sequelize");
const Badges = require("../models/Badges");

const createBadge = async (name, logoUrl, type, description) => {
  const Badge = await Badges.create({
    name,
    logoUrl,
    type,
    description,
  });
  return Badge;
};

const updateBadge = async (id, updateField) => {
  const badge = await Badges.findByPk(id);
  if (!badge) throw new Error("Insignia no encontrada");

  return await badge.update(updateField);
};

const deleteBadge = async (id) => {
  const badge = await Badges.findByPk(id);
  if (!badge) throw new Error("Insignia no encontrada");
  await Badges.destroy({ where: { id } });
  return { message: "Insignia eliminada correctamente" };
};

const getBadgeByID = async (id) => {
  const badge = await Badges.findByPk(id);
  if (!badge) throw new Error("Insignia no encontrada");
  return badge;
};

const getAllBadges = async () => {
  return await Badges.findAll();
};

module.exports = {
  createBadge,
  updateBadge,
  deleteBadge,
  getBadgeByID,
  getAllBadges,
};
