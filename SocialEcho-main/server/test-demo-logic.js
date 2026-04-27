require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Post = require("./models/post.model");
const Community = require("./models/community.model");
const bcrypt = require("bcrypt");

const testDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const demoEmail = "neil.demo@loom.com";
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      console.log("Creating user...");
      const hashedPassword = await bcrypt.hash("demo123456", 10);
      user = new User({
        name: "Neil",
        email: demoEmail,
        password: hashedPassword,
        avatar: "/demo/avatar.png",
        bio: "21 years old from Patna, Bihar. Peak performance enthusiast & tech explorer.",
        location: "Patna, Bihar",
        interests: "Fitness, Technology, Photography, Healthy Living",
        role: "general",
        isEmailVerified: true
      });
      await user.save();
      console.log("User created");
    }

    const demoPosts = [
      {
        content: "Achieving peak performance at 21! Consistency is key. #Fitness #Patna",
        fileUrl: "/demo/post1.png",
        user: user._id,
        communityName: "Health and Fitness",
      }
    ];

    for (const postData of demoPosts) {
      console.log(`Checking community: ${postData.communityName}`);
      let community = await Community.findOne({ name: postData.communityName });
      if (!community) {
        console.log("Creating community...");
        community = new Community({
          name: postData.communityName,
          description: `A place for ${postData.communityName} enthusiasts.`,
          members: [user._id],
          moderators: [user._id],
        });
        await community.save();
      }

      console.log("Creating post...");
      const newPost = new Post({
        content: postData.content,
        fileUrl: postData.fileUrl,
        user: user._id,
        community: community._id
      });
      await newPost.save();
      console.log("Post created");
    }

    console.log("Test finished successfully");
    process.exit(0);
  } catch (err) {
    console.error("TEST FAILED:", err);
    process.exit(1);
  }
};

testDemo();
