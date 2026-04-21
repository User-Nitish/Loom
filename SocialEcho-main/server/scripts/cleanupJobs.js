const cron = require("node-cron");
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../utils/s3.util");

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const cleanupOldFiles = async () => {
  console.log("Running S3 cleanup job...");
  
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const listedObjects = await s3Client.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log("No files found in S3 bucket.");
      return;
    }

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const objectsToDelete = listedObjects.Contents
      .filter(obj => new Date(obj.LastModified) < fifteenDaysAgo)
      .map(obj => ({ Key: obj.Key }));

    if (objectsToDelete.length === 0) {
      console.log("No files older than 15 days found.");
      return;
    }

    console.log(`Deleting ${objectsToDelete.length} old files...`);

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: objectsToDelete,
      },
    });

    await s3Client.send(deleteCommand);
    console.log("S3 cleanup successful.");
  } catch (error) {
    console.error("Error during S3 cleanup:", error);
  }
};

// Schedule to run every day at midnight
const initCleanupCron = () => {
  cron.schedule("0 0 * * *", cleanupOldFiles);
  console.log("S3 cleanup cron job scheduled (daily at midnight).");
};

module.exports = {
  cleanupOldFiles,
  initCleanupCron,
};
