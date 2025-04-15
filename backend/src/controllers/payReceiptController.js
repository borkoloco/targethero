const PayReceipt = require("../models/PayReceipt");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const payReceiptService = require("../services/payReceiptService");
const { uploadSignature } = require("../middleware/uploadSignature");

const uploadPayReceipt = async (req, res) => {
  try {
    const { userId, month } = req.body;
    const receipt = await PayReceipt.create({
      userId,
      month,
      fileUrl: req.file.path,
    });

    res.status(201).json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReceiptsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const receipts = await PayReceipt.findAll({
      where: { userId },
      attributes: ["id", "month", "fileUrl", "signatureUrl", "signatureStatus"],
      order: [["month", "DESC"]],
    });

    res.json(receipts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReceiptsForMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const receipts = await payReceiptService.getReceiptsForMonth(month);
    res.json(receipts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSignedReceipts = async (req, res) => {
  try {
    const receipts = await payReceiptService.getSignedReceipts;
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUploadedReceipts = async (req, res) => {
  try {
    const receipts = await PayReceipt.findAll({
      include: [{ model: User, as: "employee", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch uploaded receipts" });
  }
};

const signPayReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { signature } = req.body;

    const receipt = await PayReceipt.findByPk(id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });

    const result = await uploadSignature(signature);

    receipt.signatureUrl = result.secure_url;

    receipt.signatureStatus = "awaiting_admin_approval";

    await receipt.save();

    res.json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const approveSignature = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = await PayReceipt.findByPk(id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });

    receipt.signatureStatus = "approved";
    await receipt.save();

    res.json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const approveByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await PayReceipt.findByPk(id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });

    if (receipt.signatureStatus !== "awaiting_admin_approval") {
      return res.status(400).json({ error: "Invalid signature status" });
    }

    receipt.signatureStatus = "awaiting_approval";
    await receipt.save();

    res.json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  uploadPayReceipt,
  getReceiptsByUser,
  getReceiptsForMonth,
  getSignedReceipts,
  getUploadedReceipts,
  signPayReceipt,
  approveSignature,
  approveByAdmin,
};
