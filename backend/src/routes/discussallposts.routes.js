import { Router } from 'express'
import {authenticateUser } from '../middlewares/auth.js'
import { getAllDiscussions } from '../controllers/getalldiscussions.js'
const router = Router()

router.get('/allposts', authenticateUser, getAllDiscussions)

export default router