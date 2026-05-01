require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const Community = require("../models/community.model");

async function createIndexes() {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully.");

    console.log("Cleaning up old indexes...");
    try { await mongoose.connection.collection('users').dropIndex("name_text"); } catch (e) {}
    try { await mongoose.connection.collection('posts').dropIndex("content_text"); } catch (e) {}
    try { await mongoose.connection.collection('communities').dropIndex("name_text_description_text"); } catch (e) {}

    console.log("Creating text index for Users...");
    await mongoose.connection.collection('users').createIndex({ name: "text", email: "text" });

    console.log("Creating text index for Posts...");
    await mongoose.connection.collection('posts').createIndex({ content: "text" });

    console.log("Creating text index for Communities...");
    await mongoose.connection.collection('communities').createIndex({ name: "text", description: "text" });

    console.log("\n✅ Search indexes created successfully!");
  } catch (error) {
    console.error("❌ Error creating indexes:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

createIndexes();
