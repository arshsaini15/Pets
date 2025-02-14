import { Router } from 'express'
import { authenticateUser } from '../middlewares/auth.js'
import { LikePost } from '../controllers/discusslikepost.controller.js'

const router = Router()
router.post('/like/:id', authenticateUser, LikePost)

export default router