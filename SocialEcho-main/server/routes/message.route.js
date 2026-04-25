const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const decodeToken = require("../middlewares/auth/decodeToken");

router.use(decodeToken);

router.get("/conversations", messageController.getConversations);
router.get("/:conversationId", messageController.getMessages);
router.post("/", messageController.sendMessage);

module.exports = router;
