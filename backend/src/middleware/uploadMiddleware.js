const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const uploadsDir = path.join(__dirname, "../uploads");

// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// const sanitizeFilename = (filename) => {
//   return filename.replace(/[^a-zA-Z0-9.\-_]/g, "");
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     const sanitized = sanitizeFilename(file.originalname);
//     const finalName = `${Date.now()}-${sanitized}`;
//     cb(null, finalName);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;
