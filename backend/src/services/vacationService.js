const VacationRequest = require("../models/VacationRequest");
const User = require("../models/User");

const submitVacationRequest = async (userId, startDate, endDate, reason) => {
  return await VacationRequest.create({
    userId,
    startDate,
    endDate,
    reason,
    status: "pending",
  });
};

const getAllRequests = async () => {
  return await VacationRequest.findAll({
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
  });
};

const getRequestsByUser = async (userId) => {
  return await VacationRequest.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
};

const updateRequestStatus = async (id, status) => {
  const request = await VacationRequest.findByPk(id);
  if (!request) throw new Error("Vacation request not found");
  request.status = status;
  await request.save();
  return request;
};

module.exports = {
  submitVacationRequest,
  getAllRequests,
  getRequestsByUser,
  updateRequestStatus,
};
