import { Router } from "express"
import { authenticateUser } from "../middlewares/auth.js"
import { getPersonProfile } from "../controllers/personprofile.controller.js"
import { getUserPosts } from "../controllers/personprofile.controller.js"

const router = Router()

router.get('/:userId', authenticateUser, getPersonProfile)
router.get('/getuserposts/:userId', authenticateUser, getUserPosts)

export default router