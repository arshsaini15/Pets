import { Router } from "express"
import { authenticateUser } from '../middlewares/auth.js'
import { petsNearMe } from '../controllers/petsnearme.controller.js'

const router = Router()

router.get('/nearby', authenticateUser, petsNearMe)

export default router