import express from 'express'
import { getPetProfile } from '../controllers/petprofile.controller.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = express.Router()

router.get('/:petId', authenticateUser, getPetProfile)

export default router