import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    lastMessage: { type: String, default: "" },
    lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
)

export const Chat = mongoose.model("Chat", chatSchema)