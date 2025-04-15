const VacationRequest = require("../models/VacationRequest");
const User = require("../models/User");

const requestVacation = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const userId = req.user.id;

    const vacation = await VacationRequest.create({
      userId,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(vacation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await VacationRequest.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const vacation = await VacationRequest.findByPk(req.params.id);
    if (!vacation) return res.status(404).json({ error: "Not found" });

    if (vacation.status !== "admin_approved") {
      return res
        .status(400)
        .json({ error: "HR can only approve admin-approved requests" });
    }

    vacation.status = "approved";
    await vacation.save();
    res.json(vacation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const vacation = await VacationRequest.findByPk(req.params.id);
    if (!vacation) return res.status(404).json({ error: "Not found" });
    vacation.status = "rejected";
    await vacation.save();
    res.json(vacation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMyVacationRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await VacationRequest.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getApprovedRequests = async (req, res) => {
  try {
    const requests = await VacationRequest.findAll({
      where: { status: "approved" },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
      order: [["startDate", "DESC"]],
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveByAdmin = async (req, res) => {
  try {
    const vacation = await VacationRequest.findByPk(req.params.id);
    if (!vacation) return res.status(404).json({ error: "Not found" });

    if (vacation.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Only pending requests can be approved by admin" });
    }

    vacation.status = "admin_approved";
    await vacation.save();
    res.json(vacation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  requestVacation,
  getAllRequests,
  approveRequest,
  rejectRequest,
  getMyVacationRequests,
  getApprovedRequests,
  approveByAdmin,
};
