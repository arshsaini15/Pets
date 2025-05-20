import {Router} from "express"
import { authenticateUser } from '../middlewares/auth.js'
import { createGroup } from "../controllers/createGroup.controller.js"
const router = Router()

router.post('/create-group', authenticateUser, createGroup)

export default router