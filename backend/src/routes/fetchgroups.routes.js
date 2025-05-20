import {Router} from "express"
import { authenticateUser } from "../middlewares/auth.js"
import { getUserGroups } from "../controllers/fetchgroups.controller.js"
const router = Router()

router.get('/my-groups', authenticateUser, getUserGroups);

export default router