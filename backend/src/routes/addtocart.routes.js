import express from 'express'
import { addToCart, deleteFromCart } from '../controllers/addtocart.controller.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = express.Router()

router.post('/addtocart', authenticateUser, addToCart)
router.delete('/remove/:productId', authenticateUser, deleteFromCart)

export default router