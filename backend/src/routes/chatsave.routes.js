import { Router } from "express"
import { authenticateUser } from '../middlewares/auth.js'
import { chatSave } from "../controllers/chatsave.controller.js"
const router = Router()

router.post('/send', authenticateUser, chatSave)

export default router