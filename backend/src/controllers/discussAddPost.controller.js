import { Discussion } from "../models/discuss.models.js";
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";

export const discussAddPost = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { title, content, category, image } = req.body

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" })
    }

    const user = await User.findById(userId).select('username')

    const newPost = new Discussion({
        user: userId,
        title,
        content,
        category: category || "General",
        images: image ? [image] : [],
    })

    await newPost.save()
    res.status(201).json({
        ...newPost._doc,
        user,
    });
})