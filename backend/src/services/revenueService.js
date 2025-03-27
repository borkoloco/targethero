const Revenue = require("../models/Revenue");
const User = require("../models/User");

const createRevenueRecord = async ({ userId, amount, date, type }) => {
  const record = await Revenue.create({
    userId,
    amount,
    date: date || new Date(),
    type,
  });
  return record;
};

const getRevenueForUser = async (userId) => {
  const records = await Revenue.findAll({
    where: { userId },
    order: [["date", "DESC"]],
  });
  return records;
};

const getAllRevenue = async () => {
  const records = await Revenue.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["date", "DESC"]],
  });
  return records;
};

const updateRevenueRecord = async (id, updateData) => {
  const record = await Revenue.findByPk(id);
  if (!record) {
    throw new Error("Revenue record not found");
  }
  return await record.update(updateData);
};

const deleteRevenue = async (id) => {
  const revenue = await Revenue.findByPk(id);
  if (!revenue) throw new Error("Revenue not found");
  await revenue.destroy();
  return { message: "Revenue deleted successfully" };
};

const getRevenuePending= async()=>{
  const revenue = await Revenue.findAll({
    where:{status:"pending"},
  })
  return revenue
}

const getRevenueApproved= async()=>{
  const revenue = await Revenue.findAll({
    where:{status:"approved"},
  })
  return revenue
}
const approveRevenue = async (id) => {
  const revenue = await Revenue.findByPk(id);
  if (!revenue) {
    throw new Error("Revenue not found");
  }

  revenue.status = "approved";
  await revenue.save();

  return revenue;
};
module.exports = {
  createRevenueRecord,
  getRevenueForUser,
  getAllRevenue,
  updateRevenueRecord,
  deleteRevenue,
  getRevenuePending,
  getRevenueApproved,
  approveRevenue,
};
