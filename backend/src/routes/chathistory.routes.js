import { Router } from 'express'
import { authenticateUser } from '../middlewares/auth.js'
import { chatHistory } from '../controllers/chathistory.controller.js'
const router = Router()

router.get('/history/:chatUserId', authenticateUser, chatHistory)

export default router