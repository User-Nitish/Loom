const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file, folder = "user-uploads") => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = `${folder}/${uniqueSuffix}-${file.originalname}`;

  let fileBuffer = file.buffer;
  let contentType = file.mimetype;

  // Compress if it's an image
  if (file.mimetype.startsWith("image/")) {
    try {
      fileBuffer = await sharp(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true }) // Max width 1200px
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toBuffer();
      contentType = "image/jpeg";
    } catch (sharpError) {
      console.error("Sharp compression failed, uploading original:", sharpError);
    }
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Return the public URL
    // Format: https://bucket-name.s3.region.amazonaws.com/key
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("S3 Upload Failed");
  }
};

const deleteFromS3 = async (fileUrl) => {
  try {
    const urlParts = fileUrl.split(".amazonaws.com/");
    if (urlParts.length < 2) return;

    const key = urlParts[1];

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
  }
};

module.exports = {
  s3Client,
  uploadToS3,
  deleteFromS3,
};
