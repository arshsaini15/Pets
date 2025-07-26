import { Discussion } from "../models/discuss.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const getAllDiscussions = asyncHandler(async (req, res) => {
    const discussions = await Discussion.find()
      .populate("user", "username")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 })

    res.status(200).json(discussions)
})