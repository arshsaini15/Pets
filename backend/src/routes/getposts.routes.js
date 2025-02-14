import { Router } from "express"
import { authenticateUser } from '../middlewares/auth.js'
import { getPosts } from '../controllers/getPosts.controller.js'
const router = Router()

router.get('/getposts', authenticateUser, getPosts)

export default router