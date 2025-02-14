import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
        maxlength: 300,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Tracks users who have liked the post
        },
    ],
    comments: [
        {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        },
    ],
}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema)