import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select("-password")

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
})

export const editUsername = asyncHandler(async (req, res) => {
    const { newUsername } = req.body

    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.username = newUsername
    await user.save()

    res.status(200).json({ message: "Username changed successfully" })
})

export const editBio = asyncHandler(async (req, res) => {
    const { newBio } = req.body

    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.bio = newBio
    await user.save()

    res.status(200).json({ message: "Bio updated successfully" })
})

export const editProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })

    const imageUpload = await uploadOnCloudinary(req.file.path)
    if (!imageUpload) return res.status(500).json({ message: "Failed to upload image" })

    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.profileImage = imageUpload.secure_url
    await user.save()

    res.status(200).json({ message: "Profile image updated successfully", profileImage: user.profileImage })
})

export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await user.isPasswordCorrect(currentPassword)
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" })

    user.password = newPassword
    await user.save()

    res.status(200).json({ message: "Password changed successfully" })
})