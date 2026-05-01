require("dotenv").config();
const { deleteFromS3 } = require("../utils/s3.util");

async function cleanup() {
  const testUrl = "https://loom-nitish-7.s3.us-east-1.amazonaws.com/test-folder/1777097483666-337817459-test-file.txt";
  
  console.log("Cleaning up test file from S3...");
  try {
    await deleteFromS3(testUrl);
    console.log("✅ Cleanup successful! Test file deleted.");
  } catch (error) {
    console.error("❌ Cleanup failed:", error.message);
  }
}

cleanup();
