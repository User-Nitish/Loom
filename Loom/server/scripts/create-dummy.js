const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
require("dotenv").config({ path: "../.env" });

mongoose
  .connect("mongodb://127.0.0.1:27017/db_loom", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB for dummy creation.");

    const existingUser = await User.findOne({ email: "dummy@loom.com" });
    if (existingUser) {
      console.log("Dummy user already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const dummyUser = new User({
      name: "Dummy User",
      email: "dummy@loom.com",
      password: hashedPassword,
      role: "general",
      avatar: "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg",
      isEmailVerified: true, // Bypass verification
    });

    await dummyUser.save();
    console.log("Successfully created dummy verified user!");
    console.log("Email: dummy@loom.com");
    console.log("Password: password123");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });
