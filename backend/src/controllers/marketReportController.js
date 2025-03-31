const { getMarketReport } = require("../services/marketReportService");

const getMarketReportData = async (req, res) => {
  try {
    const report = await getMarketReport();
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getMarketReportData };
