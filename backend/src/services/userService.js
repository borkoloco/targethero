const User = require("../models/User");
const Badge = require("../models/Badge");
const Revenue = require("../models/Revenue");
const Client = require("../models/Client");
const Mission = require("../models/Mission");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

const createUser = async ({ name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
};

const updateUser = async (id, updateData) => {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return await user.update(updateData);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return await user.destroy();
};

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "points", "role"],
  });
  if (!user) throw new Error("User not found");
  return user;
};

const getUserStats = async () => {
  const users = await User.findAll({
    include: [
      { model: Mission, as: "completedMissions" },
      { model: Revenue, as: "revenues" },
      { model: Client, as: "clients" },
      { model: Badge, as: "userBadges" },
    ],
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    totalMissions: user.completedMissions?.length || 0,
    totalRevenue:
      user.revenues?.reduce((sum, r) => sum + parseFloat(r.amount), 0) || 0,

    totalClients: user.clients?.length || 0,
    totalBadges: user.userBadges?.length || 0,
  }));
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getUserStats,
};
