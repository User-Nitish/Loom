const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getNotificationsForUser(req.userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

const markRead = async (req, res) => {
    try {
        await notificationService.markAsRead(req.params.id);
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification" });
    }
};

const markAllRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.userId);
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notifications" });
    }
};

module.exports = {
    getNotifications,
    markRead,
    markAllRead
};
