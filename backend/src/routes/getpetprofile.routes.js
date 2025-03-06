import express from 'express'
import { getPetProfile } from '../controllers/petprofile.controller.js'
import { petsNearMe } from '../controllers/petsnearme.controller.js'
import { authenticateUser } from '../middlewares/auth.js'
import { getWishlist } from '../controllers/wishlist.controller.js'

const router = express.Router()

router.get('/nearby', authenticateUser, petsNearMe)
router.get('/wishlist', authenticateUser, getWishlist)
router.get('/:petId', authenticateUser, getPetProfile)

export default router