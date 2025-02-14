import { Router } from "express"
import { authenticateUser } from "../middlewares/auth.js"
import { connectionPets } from '../controllers/connectionPets.controller.js'
const router = Router()

router.get('/connectionpets', authenticateUser, connectionPets)

export default router