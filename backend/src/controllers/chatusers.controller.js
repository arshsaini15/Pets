import { Chat } from '../models/chat.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const chatUsers = asyncHandler(async (req, res) => {
    const userId = req.userId

    const users = await Chat.find({ participants: userId })
        .populate("participants", "username profileImage")
        .sort({ lastUpdated: -1 })

    res.status(200).json(users)
})