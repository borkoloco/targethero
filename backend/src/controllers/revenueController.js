const revenueService = require("../services/revenueService");

const updateRevenueRecord = async (req, res) => {
  try {
    const recordId = req.params.id;
    const updatedRecord = await revenueService.updateRevenueRecord(
      recordId,
      req.body
    );
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createRevenueRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, date, type } = req.body;
    const record = await revenueService.createRevenueRecord({
      userId,
      amount,
      date,
      type,
      status: "pending",
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveRevenue = async (req, res) => {
  try {
    const updated = await revenueService.updateRevenueStatus(
      req.params.id,
      "approved"
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMyRevenue = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await revenueService.getRevenueForUser(userId);
    res.json(records);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getRevenueByUser = async (req, res) => {
  try {
    const records = await revenueService.getAllRevenue();
    res.json(records);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteRevenue = async (req, res) => {
  try {
    const result = await revenueService.deleteRevenue(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getRevenueByUser,
  updateRevenueRecord,
  getMyRevenue,
  createRevenueRecord,
  deleteRevenue,
  approveRevenue,
};
