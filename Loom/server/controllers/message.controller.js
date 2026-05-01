const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

const getConversations = async (req, res) => {
    try {
        const userId = req.userId;
        const conversations = await Conversation.find({ participants: userId })
            .populate("participants", "name avatar")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });
            
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching conversations" });
    }
};

const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversation: conversationId })
            .populate("sender", "name avatar")
            .sort({ createdAt: 1 });
            
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;
        const senderId = req.userId;

        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId], $size: 2 }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId]
            });
            await conversation.save();
        }

        const message = new Message({
            conversation: conversation._id,
            sender: senderId,
            content
        });

        await message.save();

        conversation.lastMessage = message._id;
        conversation.updatedAt = Date.now();
        await conversation.save();

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Error sending message" });
    }
};

module.exports = {
    getConversations,
    getMessages,
    sendMessage
};
