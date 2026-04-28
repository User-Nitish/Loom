const multer = require("multer");
const { uploadToS3 } = require("../../utils/s3.util");

function avatarUpload(req, res, next) {
  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB limit
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
        message: err.code === "LIMIT_FILE_SIZE" ? "Avatar size exceeds 2MB limit" : "Error uploading avatar",
        error: err.message,
      });
    }

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
