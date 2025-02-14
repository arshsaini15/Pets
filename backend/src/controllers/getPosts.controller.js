import { Post } from '../models/post.models.js'
import { User } from '../models/user.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getPosts = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (error) {
        console.error("Error fetching posts:", error.message)
        res.status(500).json({ message: "Error fetching posts" })
    }
})