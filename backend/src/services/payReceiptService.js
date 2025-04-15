const PayReceipt = require("../models/PayReceipt");
const User = require("../models/User");
const { Op } = require("sequelize");

const createPayReceipt = async (userId, month, fileUrl) => {
  return await PayReceipt.create({ userId, month, fileUrl });
};

const getPayReceiptsByUser = async (userId) => {
  return await PayReceipt.findAll({
    where: { userId },
    order: [["month", "DESC"]],
  });
};

const getReceiptsForMonth = async (month) => {
  return await PayReceipt.findAll({
    where: { month },
    order: [["userId", "ASC"]],
  });
};

const getSignedReceipts = async () => {
  return await PayReceipt.findAll({
    where: {
      signedFileUrl: {
        [require("sequelize").Op.ne]: null,
      },
    },
    include: [
      {
        model: User,
        as: "employee",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["month", "DESC"]],
  });
};

module.exports = {
  createPayReceipt,
  getPayReceiptsByUser,
  getReceiptsForMonth,
  getSignedReceipts,
};
