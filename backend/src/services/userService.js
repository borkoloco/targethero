const User = require("../models/User");
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
};
