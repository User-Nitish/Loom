const multer = require("multer");
const { uploadToS3 } = require("../../utils/s3.util");

function fileUpload(req, res, next) {
  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")
      ) {
        cb(null, true);
      } else {
        cb(null, new Error("Only images and videos are allowed"));
      }
    },
  });

  upload.any()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.code === "LIMIT_FILE_SIZE" ? "File size exceeds 50MB limit" : "Error uploading file",
        error: err.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return next();
    }

    try {
      const file = req.files[0];
      const s3Url = await uploadToS3(file, "posts");

      req.file = file;
      req.fileUrl = s3Url;
      req.fileType = file.mimetype.split("/")[0];

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload to S3",
        error: error.message,
      });
    }
  });
}

module.exports = fileUpload;
