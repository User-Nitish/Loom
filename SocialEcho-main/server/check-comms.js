require("dotenv").config();
const mongoose = require("mongoose");
const Community = require("./models/community.model");

const checkComms = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const comms = await Community.find({});
  console.log("Communities:", comms.map(c => c.name));
  process.exit(0);
};

checkComms();
