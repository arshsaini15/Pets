import express from 'express'
import { authenticateUser } from '../middlewares/auth.js'
import { showCart } from '../controllers/showcart.controller.js'

const router = express.Router()
router.get('/showcart', authenticateUser, showCart)

export default router