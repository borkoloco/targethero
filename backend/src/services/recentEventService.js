const RecentEvent = require("../models/RecentEvent");

const addEvent = async (type, description, io = null) => {
  try {
    console.log("Adding event:", { type, description });
    const event = await RecentEvent.create({ type, description });

    if (io) {
      io.emit("newEvent", event);
    }

    return event;
  } catch (err) {
    console.error("Error saving event:", err);
    throw err;
  }
};

const getRecentEvents = async () => {
  return await RecentEvent.findAll({
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  addEvent,
  getRecentEvents,
};
