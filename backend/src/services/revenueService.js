const Revenue = require("../models/Revenue");
const User = require("../models/User");

const updateRevenueRecord = async (id, updateData) => {
  const record = await Revenue.findByPk(id);
  if (!record) {
    throw new Error("Revenue record not found");
  }

  await record.update(updateData);

  const updatedRecord = await Revenue.findByPk(id, {
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
  });

  return updatedRecord;
};

const deleteRevenue = async (id) => {
  const revenue = await Revenue.findByPk(id);
  if (!revenue) throw new Error("Revenue not found");
  await revenue.destroy();
  return { message: "Revenue deleted successfully" };
};

const createRevenueRecord = async ({ userId, amount, date, type, status }) => {
  return await Revenue.create({ userId, amount, date, type, status });
};

const updateRevenueStatus = async (id, status) => {
  const record = await Revenue.findByPk(id);
  if (!record) throw new Error("Revenue record not found");
  return await record.update({ status });
};

const getRevenueForUser = async (userId) => {
  return await Revenue.findAll({
    where: { userId, status: "approved" },
    order: [["date", "DESC"]],
  });
};

const getAllRevenue = async () => {
  return await Revenue.findAll({
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    order: [["date", "DESC"]],
  });
};

module.exports = {
  createRevenueRecord,
  getRevenueForUser,
  getAllRevenue,
  updateRevenueRecord,
  deleteRevenue,
  updateRevenueStatus,
};
