import { Router } from "express"
import { authenticateUser } from '../middlewares/auth.js'
import { showallUsers } from "../controllers/showallusers.controller.js"
const router = Router()

router.get('/showallusers', authenticateUser, showallUsers)

export default router