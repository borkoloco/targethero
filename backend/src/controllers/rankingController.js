const User = require("../models/User");

const getRanking = async (req, res) => {
  try {
    const ranking = await User.findAll({
      attributes: ["id", "name", "role", "points"],
      order: [["points", "DESC"]],
    });
    res.json(ranking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getRanking };
