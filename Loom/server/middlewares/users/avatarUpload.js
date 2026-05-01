const multer = require("multer");
const { uploadToS3 } = require("../../utils/s3.util");

function avatarUpload(req, res, next) {
  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
      ) {
        cb(null, true);
      } else {
        cb(null, new Error("Only .jpg, .jpeg and .png formats are allowed"));
      }
    },
  }).single("avatar");

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.code === "LIMIT_FILE_SIZE" ? "Avatar size exceeds 10MB limit" : "Error uploading avatar",
        error: err.message,
      });
    }

    const fs = require("fs");
    fs.appendFileSync("server-errors.log", `[DEBUG MULTER] Body: ${JSON.stringify(req.body)}, File: ${req.file ? req.file.originalname : 'none'}\n`);

    if (!req.file) {
      return next();
    }

    try {
      const file = req.file;
      const s3Url = await uploadToS3(file, "avatars");
      req.file.s3Url = s3Url;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload avatar to S3",
        error: error.message,
      });
    }
  });
}

module.exports = avatarUpload;
