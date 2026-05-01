require("dotenv").config();
const nodemailer = require("nodemailer");

async function testEmail() {
  console.log("Starting Email Test...");
  console.log("Sending from:", process.env.EMAIL);

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL, // Sending to yourself
    subject: "Loom Email Test",
    text: "If you are reading this, your Loom email configuration is 100% correct!",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("\n✅ SUCCESS!");
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("\nCheck your inbox (and spam folder) for the test email.");
  } catch (error) {
    console.error("\n❌ FAILED!");
    console.error("Error message:", error.message);
    console.log("\nHint: Make sure your App Password has NO spaces and your EMAIL is correct in .env.");
  }
}

testEmail();
