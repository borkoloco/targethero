const recentEventService = require("../services/recentEventService");

const getRecentEvents = async (req, res) => {
  try {
    const events = await recentEventService.getRecentEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRecentEvents,
};
