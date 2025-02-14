import express from 'express'
import { addToCart } from '../controllers/addtocart.controller.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = express.Router()

router.post('/addtocart', authenticateUser, addToCart)

export default router