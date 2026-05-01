const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const decodeToken = require("../middlewares/auth/decodeToken");

router.use(decodeToken);

router.get("/", notificationController.getNotifications);
router.patch("/mark-all-read", notificationController.markAllRead);
router.patch("/:id/mark-read", notificationController.markRead);

module.exports = router;
