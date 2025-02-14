import { Router } from "express"
import { authenticateUser } from '../middlewares/auth.js'
import { connectUser } from "../controllers/connect.controller.js"
const router = Router()

router.post('/connect', authenticateUser, connectUser)

export default router