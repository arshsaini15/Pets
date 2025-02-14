import { Router } from 'express'
import { authenticateUser } from '../middlewares/auth.js'
import { chatList } from '../controllers/chatlist.controller.js'
const router = Router()

router.post('/addtolist', authenticateUser, chatList)

export default router