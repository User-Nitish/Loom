require("dotenv").config();
const { uploadToS3 } = require("../utils/s3.util");

async function testS3() {
  console.log("Starting S3 Upload Test...");
  console.log("Bucket:", process.env.AWS_S3_BUCKET_NAME);
  console.log("Region:", process.env.AWS_REGION);

  const mockFile = {
    originalname: "test-file.txt",
    buffer: Buffer.from("Hello from Loom! If you see this, S3 is working."),
    mimetype: "text/plain",
  };

  try {
    const url = await uploadToS3(mockFile, "test-folder");
    console.log("\n✅ SUCCESS!");
    console.log("File uploaded to:", url);
  } catch (error) {
    console.error("\n❌ FAILED!");
    console.error("Error message:", error.message);
    if (error.message.includes("Credentials")) {
      console.log("Hint: Check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env");
    } else if (error.message.includes("Bucket")) {
      console.log("Hint: Check your AWS_S3_BUCKET_NAME in .env. Does it exist?");
    }
  }
}

testS3();
