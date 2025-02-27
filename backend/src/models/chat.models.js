import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        messages: [
            {
                sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                text: { type: String }, // Optional (can be empty if file is sent)
                fileUrl: { type: String }, // Stores file URL (Cloudinary, S3, local path, etc.)
                fileType: { type: String }, // Example: "image/png", "application/pdf"
                timestamp: { type: Date, default: Date.now },
            }
        ],
        lastMessage: { type: String, default: "" },
        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);