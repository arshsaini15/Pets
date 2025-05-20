import {Router} from "express"
import {authenticateUser} from '../middlewares/auth.js'
import {getGroupDetails} from '../controllers/getgroupdetails.controller.js'
const router = Router()

router.get('/:groupId', authenticateUser, getGroupDetails)

export default router