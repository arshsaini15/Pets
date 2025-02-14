import { Chat } from '../models/chat.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const chatSave = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { recipientId, text } = req.body

    if (!recipientId || !text) {
        return res.status(400).json({ message: "Recipient and message text are required." })
    }

    let chat = await Chat.findOne({
        participants: { $all: [userId, recipientId] }
    })

    if (!chat) {
        chat = new Chat({
            participants: [userId, recipientId],
            messages: [],
        })
    }

    const newMessage = {
        sender: userId,
        text: text,
        timestamp: new Date(),
    }

    chat.messages.push(newMessage)
    await chat.save()

    res.status(200).json({ message: "Message saved successfully", chat });
})