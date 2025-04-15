const recentEventService = require("../services/recentEventService");

const getRecentEvents = async (req, res) => {
  try {
    const events = await recentEventService.getRecentEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postRecentEvent = async (req, res) => {
  try {
    const { type, description } = req.body;
    const event = await recentEventService.addEvent(type, description, req.io);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
};

module.exports = {
  getRecentEvents,
  postRecentEvent,
};
