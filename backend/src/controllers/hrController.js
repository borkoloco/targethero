const User = require("../models/User");
const VacationRequest = require("../models/VacationRequest");

const getHRMetrics = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "role", "salary", "birthDate"],
    });

    const totalEmployees = users.length;
    const avgSalary =
      users.reduce((sum, u) => sum + (u.salary || 0), 0) / totalEmployees;

    const birthdaysThisMonth = users.filter((u) => {
      const date = new Date(u.birthDate);
      return date.getMonth() === new Date().getMonth();
    });

    const vacations = await VacationRequest.findAll();
    const totalRequests = vacations.length;
    const approvedRequests = vacations.filter(
      (v) => v.status === "approved"
    ).length;

    res.json({
      totalEmployees,
      avgSalary: Math.round(avgSalary),
      birthdayList: birthdaysThisMonth,
      totalRequests,
      approvedRequests,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getHRMetrics };
