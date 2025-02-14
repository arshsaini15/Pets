import express from "express"
import { authenticateUser } from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.middleware.js"
import { getProfile, editUsername, editBio, editProfileImage, changePassword,} from "../controllers/editprofile.controller.js"

const router = express.Router()

// Get user profile
router.get("/profile", authenticateUser, getProfile)

// Update Username
router.patch("/update-username", authenticateUser, editUsername)

// Update Bio
router.patch("/update-bio", authenticateUser, editBio)

// Update Profile Image
router.patch("/update-profile-image", authenticateUser, upload.single("profileImage"), editProfileImage)

// Change Password
router.patch("/change-password", authenticateUser, changePassword)

export default router