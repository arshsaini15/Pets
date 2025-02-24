import { Router } from 'express'
import { allPets } from '../controllers/allpets.controller.js'
const router = Router()

router.get('/allpets', allPets)

export default router