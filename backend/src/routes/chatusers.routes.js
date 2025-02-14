import { Router } from 'express'
import { authenticateUser } from '../middlewares/auth.js'
import { chatUsers } from '../controllers/chatusers.controller.js'
const router = Router()

router.get('/users', authenticateUser, chatUsers)

export default router