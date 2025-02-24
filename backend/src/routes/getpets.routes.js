import express from 'express'
import { getPets, DeletePet } from '../controllers/getPets.controller.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = express.Router()

router.get('/getpets', authenticateUser, getPets)
router.delete('/getpets', authenticateUser, DeletePet)

export default router