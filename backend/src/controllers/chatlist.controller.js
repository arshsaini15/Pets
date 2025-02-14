import { Chat } from '../models/chat.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const chatList = asyncHandler (async (req, res) => {
    const userId = req.userId
    const { chatUserId } = req.body

    if (!chatUserId) {
        return res.status(400).json({ message: "User ID is required" })
    }

    let chat = await Chat.findOne({
        participants: { $all: [userId, chatUserId] }
    })

    if (chat) {
        return res.status(200).json({ message: "Participant is already in the chat list", chat })
    }

    chat = await Chat.create({
        participants: [userId, chatUserId],
        lastUpdated: new Date()
    })

    res.status(201).json({ message: "User added to chat list successfully", chat })
})