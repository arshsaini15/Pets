import { Chat } from '../models/chat.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const chatHistory = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { chatUserId } = req.params

    if (!chatUserId) {
        return res.status(400).json({ message: "chatUserId is required" })
    }

    const chat = await Chat.findOne({
        participants: { $all: [userId, chatUserId] }
    }).populate("messages.sender", "username profileImage")

    if (!chat) {
        return res.status(404).json({ message: "No chat history found" })
    }

    res.status(200).json(chat.messages)
})