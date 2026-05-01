const Notification = require("../models/notification.model");

/**
 * Creates a notification for a user.
 * 
 * @param {string} recipientId - The ID of the user receiving the notification.
 * @param {string} senderId - The ID of the user who triggered the notification.
 * @param {string} type - The type of notification ('like', 'comment', 'follow', etc.).
 * @param {Object} data - Optional IDs for post or community.
 */
const createNotification = async (recipientId, senderId, type, data = {}, io = null) => {
    try {
        // Don't notify if the user is acting on their own content
        if (recipientId.toString() === senderId.toString()) return;

        const notification = new Notification({
            recipient: recipientId,
            sender: senderId,
            type: type,
            post: data.postId || null,
            community: data.communityId || null
        });

        await notification.save();
        
        // Real-time delivery via Socket.io
        if (io) {
            const populatedNotification = await Notification.findById(notification._id)
                .populate("sender", "name avatar")
                .populate("post", "content")
                .populate("community", "name")
                .lean();
            
            io.to(`user_${recipientId}`).emit("new_notification", populatedNotification);
        }
        
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

const getNotificationsForUser = async (userId, limit = 20) => {
    try {
        return await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("sender", "name avatar")
            .populate("post", "content")
            .populate("community", "name")
            .lean();
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

const markAsRead = async (notificationId) => {
    try {
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

const markAllAsRead = async (userId) => {
    try {
        await Notification.updateMany({ recipient: userId }, { isRead: true });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
    }
};

module.exports = {
    createNotification,
    getNotificationsForUser,
    markAsRead,
    markAllAsRead
};
