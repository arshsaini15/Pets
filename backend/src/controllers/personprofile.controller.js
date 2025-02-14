import { User } from '../models/user.models.js'
import { Pet } from '../models/pet.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getPersonProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId).select("-password")

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
        connections: user.connections,
    })
})

export const getUserPosts = asyncHandler(async (req, res) => {
    const { userId } = req.params
    console.log(userId)
    

    const posts = await Pet.find({ owner: userId })

    if (!posts || posts.length === 0) {
        console.log('posts not found')
        return res.status(404).json({ message: "No posts found for this user." })
    }

    res.status(200).json(posts);
})