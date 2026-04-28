const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const Post = require("../models/post.model");
const Community = require("../models/community.model");
const UserPreference = require("../models/preference.model");
const formatCreatedAt = require("../utils/timeConverter");
const { verifyContextData, types } = require("./auth.controller");
const { saveLogInfo } = require("../middlewares/logger/logInfo");
const duration = require("dayjs/plugin/duration");
const dayjs = require("dayjs");
dayjs.extend(duration);

const LOG_TYPE = {
  SIGN_IN: "sign in",
  LOGOUT: "logout",
};

const LEVEL = {
  INFO: "info",
  ERROR: "error",
  WARN: "warn",
};

const MESSAGE = {
  SIGN_IN_ATTEMPT: "User attempting to sign in",
  SIGN_IN_ERROR: "Error occurred while signing in user: ",
  INCORRECT_EMAIL: "Incorrect email",
  INCORRECT_PASSWORD: "Incorrect password",
  DEVICE_BLOCKED: "Sign in attempt from blocked device",
  CONTEXT_DATA_VERIFY_ERROR: "Context data verification failed",
  MULTIPLE_ATTEMPT_WITHOUT_VERIFY:
    "Multiple sign in attempts detected without verifying identity.",
  LOGOUT_SUCCESS: "User has logged out successfully",
};

const signin = async (req, res, next) => {
  await saveLogInfo(
    req,
    "User attempting to sign in",
    LOG_TYPE.SIGN_IN,
    LEVEL.INFO
  );

  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({
      email: { $eq: email },
    });
    if (!existingUser) {
      await saveLogInfo(
        req,
        MESSAGE.INCORRECT_EMAIL,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR
      );

      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    console.log(`Login attempt for: ${email} | Password Match: ${isPasswordCorrect}`);

    if (!isPasswordCorrect) {
      await saveLogInfo(
        req,
        MESSAGE.INCORRECT_PASSWORD,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR
      );

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isContextAuthEnabled = await UserPreference.findOne({
      user: existingUser._id,
      enableContextBasedAuth: true,
    });

    if (isContextAuthEnabled) {
      const contextDataResult = await verifyContextData(req, existingUser);

      if (contextDataResult === types.BLOCKED) {
        await saveLogInfo(
          req,
          MESSAGE.DEVICE_BLOCKED,
          LOG_TYPE.SIGN_IN,
          LEVEL.WARN
        );

        return res.status(401).json({
          message:
            "You've been blocked due to suspicious login activity. Please contact support for assistance.",
        });
      }

      if (
        contextDataResult === types.NO_CONTEXT_DATA ||
        contextDataResult === types.ERROR
      ) {
        await saveLogInfo(
          req,
          MESSAGE.CONTEXT_DATA_VERIFY_ERROR,
          LOG_TYPE.SIGN_IN,
          LEVEL.ERROR
        );

        return res.status(500).json({
          message: "Error occurred while verifying context data",
        });
      }

      if (contextDataResult === types.SUSPICIOUS) {
        await saveLogInfo(
          req,
          MESSAGE.MULTIPLE_ATTEMPT_WITHOUT_VERIFY,
          LOG_TYPE.SIGN_IN,
          LEVEL.WARN
        );

        return res.status(401).json({
          message: `You've temporarily been blocked due to suspicious login activity. We have already sent a verification email to your registered email address. 
          Please follow the instructions in the email to verify your identity and gain access to your account.

          Please note that repeated attempts to log in without verifying your identity will result in this device being permanently blocked from accessing your account.
          
          Thank you for your cooperation`,
        });
      }

      if (contextDataResult.mismatchedProps) {
        const mismatchedProps = contextDataResult.mismatchedProps;
        const currentContextData = contextDataResult.currentContextData;
        if (
          mismatchedProps.some((prop) =>
            [
              "ip",
              "country",
              "city",
              "device",
              "deviceLOG_TYPE",
              "os",
              "platform",
              "browser",
            ].includes(prop)
          )
        ) {
          req.mismatchedProps = mismatchedProps;
          req.currentContextData = currentContextData;
          req.user = existingUser;
          return next();
        }
      }
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const newRefreshToken = new Token({
      user: existingUser._id,
      refreshToken,
      accessToken,
    });
    await newRefreshToken.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser.avatar,
      },
    });
  } catch (err) {
    await saveLogInfo(
      req,
      MESSAGE.SIGN_IN_ERROR + err.message,
      LOG_TYPE.SIGN_IN,
      LEVEL.ERROR
    );

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const demoSignin = async (req, res, next) => {
  try {
    const Comment = require("../models/comment.model");
    const Relationship = require("../models/relationship.model");

    // 1. Ensure Communities exist with simple language
    const communities = [
      { name: "Health and Fitness", description: "Share your gym journey and healthy eating tips." },
      { name: "Patna Community", description: "A place for people from Patna to connect and share local news." }
    ];

    const seededCommunities = [];
    for (const com of communities) {
      let c = await Community.findOne({ name: com.name });
      if (!c) {
        c = new Community({ name: com.name, description: com.description });
        await c.save();
      }
      seededCommunities.push(c);
    }

    // 2. Ensure Bots exist
    const botsData = [
      { name: "Aarav", email: "aarav.bot@loom.com", avatar: "https://i.pravatar.cc/150?u=aarav" },
      { name: "Priya", email: "priya.bot@loom.com", avatar: "https://i.pravatar.cc/150?u=priya" },
      { name: "Rahul", email: "rahul.bot@loom.com", avatar: "https://i.pravatar.cc/150?u=rahul" }
    ];

    const bots = [];
    for (const b of botsData) {
      let bot = await User.findOne({ email: b.email });
      if (!bot) {
        const h = await bcrypt.hash("bot123", 10);
        bot = new User({ ...b, password: h, isEmailVerified: true });
        await bot.save();
      }
      bots.push(bot);
    }

    // 3. Ensure Neil exists
    const demoEmail = "neil.demo@loom.com";
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const hashedPassword = await bcrypt.hash("demo123456", 10);
      user = new User({
        name: "Neil",
        email: demoEmail,
        password: hashedPassword,
        avatar: "/demo/avatar.png",
        bio: "21 years old from Patna, Bihar. I love gym and my city.",
        location: "Patna, Bihar",
        role: "general",
        isEmailVerified: true
      });
      await user.save();
    }

    // 4. Ensure Neil is in the communities
    for (const c of seededCommunities) {
      if (!c.members.includes(user._id)) {
        c.members.push(user._id);
        await c.save();
      }
    }

    // 5. Seed Neil's Posts if they don't exist
    const existingPosts = await Post.find({ user: user._id });
    if (existingPosts.length === 0) {
      const post1 = new Post({
        user: user._id,
        community: seededCommunities[0]._id,
        content: "Just finished a heavy leg day! Feeling great. How is everyone's workout going today?",
        fileUrl: "/demo/gym_post.png",
        fileType: "image"
      });
      await post1.save();

      const post2 = new Post({
        user: user._id,
        community: seededCommunities[1]._id,
        content: "Love walking around the city in the evening. Patna is beautiful!",
        fileUrl: "/demo/patna_post.png",
        fileType: "image"
      });
      await post2.save();

      // Add Fake Interactions to Post 1
      post1.likes = bots.map(b => b._id);
      await post1.save();

      // Seed a Bot post for Neil to save
      const botPost = new Post({
        user: bots[0]._id,
        community: seededCommunities[0]._id,
        content: "Consistency is key! Don't skip your Monday workouts.",
        fileUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
        fileType: "image"
      });
      await botPost.save();

      // Neil saves his own posts and the bot post
      user.savedPosts = [post1._id, post2._id, botPost._id];
      await user.save();

      const comments = [
        { user: bots[0]._id, content: "Great work Neil! Keep it up." },
        { user: bots[1]._id, content: "Motivation for today! Awesome." }
      ];

      for (const com of comments) {
        const newCom = new Comment({ ...com, postId: post1._id });
        await newCom.save();
        post1.comments.push(newCom._id);
      }
      await post1.save();
    }

    const payload = { id: user._id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.SECRET, { expiresIn: "6h" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });

    const newRefreshToken = new Token({ user: user._id, refreshToken, accessToken });
    await newRefreshToken.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("DEMO LOGIN ERROR:", err);
    res.status(500).json({ message: "Demo login failed: " + err.message });
  }
};

/**
 * Retrieves a user's profile information, including their total number of posts,
 * the number of communities they are in, the number of communities they have posted in,
 * and their duration on the platform.

 * @param req - Express request object
 * @param res - Express response object
 * @param {Function} next - Express next function
 */
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();

    const totalPosts = await Post.countDocuments({ user: user._id });

    const communities = await Community.find({ members: user._id });
    const totalCommunities = communities.length;

    const postCommunities = await Post.find({ user: user._id }).distinct(
      "community"
    );
    const totalPostCommunities = postCommunities.length;

    const createdAt = dayjs(user.createdAt);
    const now = dayjs();
    const durationObj = dayjs.duration(now.diff(createdAt));
    const durationMinutes = durationObj.asMinutes();
    const durationHours = durationObj.asHours();
    const durationDays = durationObj.asDays();

    user.totalPosts = totalPosts;
    user.totalCommunities = totalCommunities;
    user.totalPostCommunities = totalPostCommunities;
    user.duration = "";

    if (durationMinutes < 60) {
      user.duration = `${Math.floor(durationMinutes)} minutes`;
    } else if (durationHours < 24) {
      user.duration = `${Math.floor(durationHours)} hours`;
    } else if (durationDays < 365) {
      user.duration = `${Math.floor(durationDays)} days`;
    } else {
      const durationYears = Math.floor(durationDays / 365);
      user.duration = `${durationYears} years`;
    }
    const posts = await Post.find({ user: user._id })
      .populate("community", "name members")
      .limit(20)
      .lean()
      .sort({ createdAt: -1 });

    user.posts = posts.map((post) => ({
      ...post,
      isMember: post.community?.members
        .map((member) => member.toString())
        .includes(user._id.toString()),
      createdAt: formatCreatedAt(post.createdAt),
    }));

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Adds a new user to the database with the given name, email, password, and avatar.
 *
 * @description If the email domain of the user's email is "mod.loom.com", the user will be
 * assigned the role of "moderator" by default, but not necessarily as a moderator of any community.
 * Otherwise, the user will be assigned the role of "general" user.
 *
 * @param {Object} req.files - The files attached to the request object (for avatar).
 * @param {string} req.body.isConsentGiven - Indicates whether the user has given consent to enable context based auth.
 * @param {Function} next - The next middleware function to call if consent is given by the user to enable context based auth.
 */
const addUser = async (req, res, next) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  /**
   * @type {boolean} isConsentGiven
   */
  const isConsentGiven = JSON.parse(req.body.isConsentGiven);

  const defaultAvatar =
    "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg";
  const fileUrl = req.files?.[0]?.s3Url ? req.files[0].s3Url : defaultAvatar;

  const emailDomain = req.body.email.split("@")[1];
  const role = emailDomain === "mod.loom.com" ? "moderator" : "general";

  newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: role,
    avatar: fileUrl,
  });

  try {
    await newUser.save();
    console.log(`New user created: ${newUser.email}`);

    res.status(201).json({
      message: "User added successfully. You can now log in!",
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to add user",
    });
  }
};

const logout = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1] ?? null;
    if (accessToken) {
      await Token.deleteOne({ accessToken });
      await saveLogInfo(
        null,
        MESSAGE.LOGOUT_SUCCESS,
        LOG_TYPE.LOGOUT,
        LEVEL.INFO
      );
    }
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    await saveLogInfo(null, err.message, LOG_TYPE.LOGOUT, LEVEL.ERROR);
    res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const existingToken = await Token.findOne({
      refreshToken: { $eq: refreshToken },
    });
    if (!existingToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
    const existingUser = await User.findById(existingToken.user);
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const refreshTokenExpiresAt =
      jwt.decode(existingToken.refreshToken).exp * 1000;
    if (Date.now() >= refreshTokenExpiresAt) {
      await existingToken.deleteOne();
      return res.status(401).json({
        message: "Expired refresh token",
      });
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    });

    res.status(200).json({
      accessToken,
      refreshToken: existingToken.refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * @route GET /users/moderator
 */
const getModProfile = async (req, res) => {
  try {
    const moderator = await User.findById(req.userId);
    if (!moderator) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const moderatorInfo = {
      ...moderator._doc,
    };
    delete moderatorInfo.password;
    moderatorInfo.createdAt = moderatorInfo.createdAt.toLocaleString();

    res.status(200).json({
      moderatorInfo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * @route PUT /users/:id
 */
const updateInfo = async (req, res) => {
  const fs = require("fs");
  fs.appendFileSync("server-errors.log", `[DEBUG UPDATE START] User: ${req.userId}, Params: ${req.params.id}\n`);
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { name, location, interests, bio } = req.body;
    const fileUrl = req.file?.s3Url ? req.file.s3Url : null;

    // DEBUG LOG
    const fs = require("fs");
    fs.appendFileSync("server-errors.log", `[DEBUG UPDATE] User: ${req.userId}, Name: ${name}, FileUrl: ${fileUrl}\n`);

    const updateData = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (interests) updateData.interests = interests;
    if (bio) updateData.bio = bio;
    if (fileUrl) updateData.avatar = fileUrl;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true }
    ).select("-password").lean();

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({
      message: "Error updating user info",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { deleteFromS3 } = require("../utils/s3.util");
    const Relationship = require("../models/relationship.model");
    const Comment = require("../models/comment.model");
    const Token = require("../models/token.model");

    // 1. Delete Avatar from S3 (if not default)
    if (user.avatar && !user.avatar.includes("public-files/main/dp.jpg")) {
      await deleteFromS3(user.avatar);
    }

    // 2. Find all user posts and delete their S3 attachments
    const userPosts = await Post.find({ user: userId });
    for (const post of userPosts) {
      if (post.fileUrl) {
        await deleteFromS3(post.fileUrl);
      }
    }

    // 3. Delete all user posts and comments
    await Post.deleteMany({ user: userId });
    await Comment.deleteMany({ user: userId });

    // 4. Remove from all relationships
    await Relationship.deleteMany({
      $or: [{ follower: userId }, { following: userId }],
    });

    // 5. Remove from all communities
    await Community.updateMany(
      { members: userId },
      { $pull: { members: userId, moderators: userId, bannedUsers: userId } }
    );

    // 6. Delete all tokens
    await Token.deleteMany({ user: userId });

    // 7. Delete User
    await user.remove();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account" });
  }
};

module.exports = {
  addUser,
  signin,
  logout,
  refreshToken,
  getModProfile,
  getUser,
  updateInfo,
  deleteAccount,
  demoSignin,
};
