import { Discussion } from "../models/discuss.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const LikePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    console.log("Post ID:", postId);
    console.log("User ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Discussion.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes || 0;

    if (!post.likedBy) {
      post.likedBy = [];
    }

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likes -= 1;
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
    } else {
      post.likes += 1;
      post.likedBy.push(userId);
    }

    console.log("Likes before saving:", post.likes);

    await post.save();

    res.status(200).json({ likes: post.likes, likedByUser: !alreadyLiked });
});
