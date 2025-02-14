import { Router } from 'express'
import { getProductDetails } from '../controllers/productdetail.controller.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = Router()

router.get('/:id', authenticateUser, getProductDetails)

export default router