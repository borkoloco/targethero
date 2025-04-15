const cloudinary = require("cloudinary").v2;

const uploadSignature = async (base64) => {
  return await cloudinary.uploader.upload(base64, {
    folder: "signatures",
    resource_type: "image",
  });
};

module.exports = { uploadSignature };
