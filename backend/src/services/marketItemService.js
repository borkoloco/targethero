const MarketItem = require("../models/MarketItem");

async function createMarketItem(data) {
  return await MarketItem.create(data);
}

async function getAllMarketItems() {
  return await MarketItem.findAll();
}

async function updateMarketItem(id, data) {
  const item = await MarketItem.findByPk(id);
  if (!item) throw new Error("Market item not found");
  console.log("Before update:", item.toJSON());
  const updatedItem = await item.update(data);
  console.log("After update:", updatedItem.toJSON());
  return updatedItem;
}

async function deleteMarketItem(id) {
  const item = await MarketItem.findByPk(id);
  if (!item) throw new Error("Market item not found");
  await item.destroy();
  return { message: "Market item deleted successfully" };
}

module.exports = {
  createMarketItem,
  getAllMarketItems,
  updateMarketItem,
  deleteMarketItem,
};
