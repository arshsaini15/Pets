import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

export const updateBio = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id).select("-password");
    console.log('user is: ', user);


    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.bio = req.body.bio;

    await user.save();

    res.status(200).json({
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
    });
});