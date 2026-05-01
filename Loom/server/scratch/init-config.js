require("dotenv").config();
const mongoose = require("mongoose");
const Config = require("../models/config.model");

async function initConfig() {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully.");

    const existingConfig = await Config.findOne();
    
    if (existingConfig) {
      console.log("Updating existing configuration...");
      existingConfig.categoryFilteringServiceProvider = "InterfaceAPI";
      existingConfig.categoryFilteringRequestTimeout = 30000;
      await existingConfig.save();
    } else {
      console.log("Creating new configuration...");
      const newConfig = new Config({
        usePerspectiveAPI: false, // Keeping false as we didn't get the key
        categoryFilteringServiceProvider: "InterfaceAPI",
        categoryFilteringRequestTimeout: 30000
      });
      await newConfig.save();
    }

    console.log("\n✅ Configuration set to use Hugging Face (InterfaceAPI)!");
    console.log("This will use the bart-large-mnli model for free in the cloud.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

initConfig();
