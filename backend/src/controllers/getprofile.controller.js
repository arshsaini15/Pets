import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"

export const getProfileImage = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    await user.populate('connections')

    res.status(200).json({username: user.username , profileImage: user.profileImage, bio:user.bio, connections: user.connections })
})