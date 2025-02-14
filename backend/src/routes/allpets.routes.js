import { Router } from 'express'
import { authenticateUser } from '../middlewares/auth.js'
import { allPets } from '../controllers/allpets.controller.js'
const router = Router()

router.get('/allpets', authenticateUser, allPets)

export default router