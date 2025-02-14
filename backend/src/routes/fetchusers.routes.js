import { Router } from "express"
import { authenticateUser } from "../middlewares/auth.js"
import { fetchUsers } from "../controllers/fetchusers.controller.js"
const router = Router()

router.get('/fetchpeople', authenticateUser, fetchUsers)

export default router