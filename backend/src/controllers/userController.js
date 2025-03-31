const userService = require("../services/userService");

const listUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to get user stats" });
  }
};

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  getUserStats,
};
