import { Chat } from '../models/chat.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const chatSave = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { recipientId, text } = req.body;

    if (!recipientId || (!text && !req.file)) {
        return res.status(400).json({ message: "Message must contain text or a file." });
    }

    let fileU = null;
    if (req.file) {
        const uploadedFile = await uploadOnCloudinary(req.file.path);
        fileU = uploadedFile.secure_url;  // Store Cloudinary URL
    }

    let chat = await Chat.findOne({
        participants: { $all: [userId, recipientId] }
    });

    if (!chat) {
        chat = new Chat({
            participants: [userId, recipientId],
            messages: [],
        });
    }

    const newMessage = {
        sender: userId,
        text: text || "",
        fileUrl: fileU,
        timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    chat.lastMessage = text || "📎 File sent";
    chat.lastUpdated = new Date();

    await chat.save();

    res.status(200).json({ message: "Message saved successfully", chat });
});