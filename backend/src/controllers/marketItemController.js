const marketItemService = require("../services/marketItemService");
const recentEventService = require("../services/recentEventService");

const createItem = async (req, res) => {
  try {
    const newItem = await marketItemService.createMarketItem(req.body);

    const io = req.app.get("io");
    io.emit("newMarketItem", newItem);
    await recentEventService.addEvent(
      "market",
      `New product published: ${newItem.name}`,
      io
    );

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await marketItemService.getAllMarketItems();
    res.json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const updatedItem = await marketItemService.updateMarketItem(
      req.params.id,
      req.body
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const result = await marketItemService.deleteMarketItem(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createItem, getItems, updateItem, deleteItem };
