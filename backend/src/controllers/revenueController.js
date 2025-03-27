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
    });
    res.status(201).json(record);
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

const getRevenuePending = async(req, res) =>{
  try{
    const revenue = await revenueService.getRevenuePending();
    res.json(revenue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRevenueApproved = async(req, res) =>{
  try{
    const revenue = await revenueService.getRevenueApproved();
    res.json(revenue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveRevenue = async (req, res) => {
  try {
    const { id } = req.params;

    const revenue = await revenueService.approveRevenue(id);

    res.json({ message: "Revenue approved successfully", revenue });
  } catch (error) {
    res.status( error.message === "Revenue not found" ? 404 : 500 ).json({
      error: error.message || "Error approving revenue",
    });
  }
};


module.exports = {
  getRevenueByUser,
  updateRevenueRecord,
  getMyRevenue,
  createRevenueRecord,
  deleteRevenue,
  getRevenuePending,
  getRevenueApproved,
  approveRevenue,
};
