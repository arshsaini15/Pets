import express from 'express'
import { addToCart, deleteFromCart, decreaseAmount, increaseAmount } from '../controllers/addtocart.controller.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = express.Router()

router.post('/addtocart', authenticateUser, addToCart)
router.delete('/remove/:productId', authenticateUser, deleteFromCart)
router.patch('/remove/:productId', authenticateUser, decreaseAmount)
router.patch('/increase/:productId', authenticateUser, increaseAmount)

export default router