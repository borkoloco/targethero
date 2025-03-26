const XLSX = require("xlsx");
const Mission = require("../models/Mission");
const Badge = require("../models/Badge");

const parseExcelFile = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
};

const importMissions = async (buffer) => {
  const data = parseExcelFile(buffer);

  for (const mission of data) {
    const { name, type, description, points, evidenceRequired } = mission;
    if (name && type && points !== undefined) {
      await Mission.create({
        name,
        type,
        description: description || "",
        points: Number(points),
        evidenceRequired:
          evidenceRequired === "true" || evidenceRequired === true,
      });
    }
  }

  return data.length;
};

const importBadges = async (buffer) => {
  const data = parseExcelFile(buffer);

  for (const badge of data) {
    const { name, type, description, logoUrl } = badge;

    if (name && type && logoUrl) {
      await Badge.create({ name, type, description, logoUrl });
    }
  }

  return data.length;
};

module.exports = {
  importMissions,
  importBadges,
};
