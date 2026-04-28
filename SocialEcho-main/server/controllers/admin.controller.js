const Log = require("../models/log.model");
const dayjs = require("dayjs");
const formatCreatedAt = require("../utils/timeConverter");
const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminToken = require("../models/token.admin.model");
const Config = require("../models/config.model");
const Community = require("../models/community.model");
const User = require("../models/user.model");
const Report = require("../models/report.model");
const Post = require("../models/post.model");

/**
 * @route GET /admin/logs
 */
const retrieveLogInfo = async (req, res) => {
  try {
    const [signInLogs, generalLogs] = await Promise.all([
      Log.find({ type: "sign in" }).sort({ timestamp: -1 }).limit(100),
      Log.find({ type: { $ne: "sign in" } }).sort({ timestamp: -1 }).limit(100),
    ]);

    const formattedSignInLogs = signInLogs.map((logDocument) => {
      try {
        const log = logDocument.toObject ? logDocument.toObject() : logDocument;
        const { _id, email, context, message, type, level, timestamp } = log;
        
        const formattedContext = {};
        if (context && typeof context === "string") {
          const contextPairs = context.split(",").map(p => p.trim()).filter(p => p.includes(":"));
          
          contextPairs.forEach(pair => {
            const firstColonIndex = pair.indexOf(":");
            const key = pair.substring(0, firstColonIndex).trim();
            const value = pair.substring(firstColonIndex + 1).trim();
            
            if (key === "IP") {
              formattedContext["IP Address"] = value;
            } else if (key) {
              formattedContext[key] = value || "unknown";
            }
          });
        }

        return {
          _id,
          email: email || "system",
          contextData: Object.keys(formattedContext).length > 0 ? formattedContext : { info: "No data available" },
          message: message || "No message",
          type,
          level,
          timestamp,
        };
      } catch (err) {
        console.error("Error formatting individual sign-in log:", err);
        return null;
      }
    }).filter(log => log !== null);

    const formattedGeneralLogs = generalLogs.map((logDocument) => {
      const log = logDocument.toObject ? logDocument.toObject() : logDocument;
      return {
        _id: log._id,
        email: log.email || "system",
        message: log.message,
        type: log.type,
        level: log.level,
        timestamp: log.timestamp,
      };
    });

    const formattedLogs = [...formattedSignInLogs, ...formattedGeneralLogs]
      .map((log) => ({
        ...log,
        formattedTimestamp: formatCreatedAt(log.timestamp),
        relativeTimestamp: dayjs(log.timestamp).fromNow(),
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json(formattedLogs);
  } catch (error) {
    console.error("CRITICAL ERROR IN retrieveLogInfo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @route DELETE /admin/logs
 */
const deleteLogInfo = async (req, res) => {
  try {
    await Log.deleteMany({});
    res.status(200).json({ message: "All logs deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @route POST /admin/signin
 */
const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await Admin.findOne({
      username,
    });
    if (!existingUser) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const payload = {
      id: existingUser._id,
      username: existingUser.username,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    });

    const newAdminToken = new AdminToken({
      user: existingUser._id,
      accessToken,
    });

    await newAdminToken.save();

    res.status(200).json({
      accessToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingUser._id,
        username: existingUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/**
 * @route GET /admin/preferences
 */
const retrieveServicePreference = async (req, res) => {
  try {
    const config = await Config.findOne({});

    if (!config) {
      const newConfig = new Config();
      await newConfig.save();
      return res.status(200).json(newConfig);
    }

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving system preferences" });
  }
};

/**
 * @route PUT /admin/preferences
 */
const updateServicePreference = async (req, res) => {
  try {
    const {
      usePerspectiveAPI,
      categoryFilteringServiceProvider,
      categoryFilteringRequestTimeout,
    } = req.body;

    const config = await Config.findOneAndUpdate(
      {},
      {
        usePerspectiveAPI,
        categoryFilteringServiceProvider,
        categoryFilteringRequestTimeout,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Error updating system preferences" });
  }
};

const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find({}).select("_id name banner");
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving communities" });
  }
};

const getCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId)
      .select("_id name description banner moderators members")
      .populate("moderators", "_id name")
      .lean();

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const moderatorCount = community.moderators.length;
    const memberCount = community.members.length;
    const formattedCommunity = {
      ...community,
      memberCount,
      moderatorCount,
    };
    res.status(200).json(formattedCommunity);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving community" });
  }
};

const getModerators = async (req, res) => {
  try {
    const moderators = await User.find({ role: "moderator" }).select(
      "_id name email"
    );
    res.status(200).json(moderators);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving moderators" });
  }
};
const addModerator = async (req, res) => {
  try {
    const { communityId, moderatorId } = req.query;
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const existingModerator = community.moderators.find(
      (mod) => mod.toString() === moderatorId
    );
    if (existingModerator) {
      return res.status(400).json({ message: "Already a moderator" });
    }
    community.moderators.push(moderatorId);
    community.members.push(moderatorId);
    await community.save();
    res.status(200).json({ message: "Moderator added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding moderator" });
  }
};

const removeModerator = async (req, res) => {
  try {
    const { communityId, moderatorId } = req.query;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const existingModerator = community.moderators.find(
      (mod) => mod.toString() === moderatorId
    );
    if (!existingModerator) {
      return res.status(400).json({ message: "Not a moderator" });
    }
    community.moderators = community.moderators.filter(
      (mod) => mod.toString() !== moderatorId
    );
    community.members = community.members.filter(
      (mod) => mod.toString() !== moderatorId
    );

    await community.save();
    res.status(200).json({ message: "Moderator removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing moderator" });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "pending" })
      .populate("post")
      .populate("community", "name")
      .populate("reportedBy", "name")
      .sort({ reportDate: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
};

const actOnReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action } = req.body; // 'resolve' or 'dismiss'

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (action === "resolve") {
      // Delete the post
      await Post.findByIdAndDelete(report.post);
      report.status = "resolved";
    } else if (action === "dismiss") {
      report.status = "dismissed";
    }

    await report.save();
    res.status(200).json({ message: `Report ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error acting on report" });
  }
};

module.exports = {
  retrieveServicePreference,
  updateServicePreference,
  retrieveLogInfo,
  deleteLogInfo,
  signin,
  getCommunities,
  getCommunity,
  addModerator,
  removeModerator,
  getModerators,
  getAllReports,
  actOnReport,
};
