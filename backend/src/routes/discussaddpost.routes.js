import { Router } from "express"
import { authenticateUser } from '../middlewares/auth.js'
import { discussAddPost } from '../controllers/discussAddPost.controller.js'
const router = Router()

router.post('/discussadd', authenticateUser, discussAddPost)

export default router