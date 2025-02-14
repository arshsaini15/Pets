import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
  },
  category: {
    type: String,
    default: "General",
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0, // Ensure likes are never negative
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  comments: {
    type: [
      {
        content: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
}, { timestamps: true });

export const Discussion = mongoose.model("Discussion", discussionSchema)