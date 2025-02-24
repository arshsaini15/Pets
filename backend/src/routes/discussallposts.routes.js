import { Router } from 'express'
import { getAllDiscussions } from '../controllers/getalldiscussions.js'
const router = Router()

router.get('/allposts', getAllDiscussions)

export default router