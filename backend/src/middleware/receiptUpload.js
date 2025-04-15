const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "receipts",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    public_id: (req, file) => `receipt-${Date.now()}`,
  },
});

const receiptUpload = multer({ storage });

module.exports = receiptUpload;
