import express from 'express'
import { getPets } from '../controllers/getPets.controller.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = express.Router()

router.get('/getpets', authenticateUser, getPets)

export default router