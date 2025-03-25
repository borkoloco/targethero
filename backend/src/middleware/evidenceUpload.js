const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "evidence",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    public_id: (req, file) => `evidence-${Date.now()}`,
  },
});

const upload = multer({ storage });

module.exports = upload;
