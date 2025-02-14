import express from 'express'
import { verifyAdmin } from '../middlewares/verifyAdmin.js'
import { Admin } from '../models/admin.models.js'

const router = express.Router()

router.get('/profile', verifyAdmin, async (req, res) => {
    try {

        
        console.log('req.admin:', req.admin)
        const admin = await Admin.findById(req.admin._id)

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' })
        }

        res.status(200).json({ username: admin.username, profileImage: admin.profileImage })

    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch admin profile' })
    }
})


export default router