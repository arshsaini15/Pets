import { Router } from "express"
import { authenticateUser } from '../middlewares/auth.js'
import { chatSave } from "../controllers/chatsave.controller.js"
import { upload }  from '../middlewares/multer.middleware.js'
const router = Router()

router.post('/send', authenticateUser, upload.single("fileUrl"), chatSave)

export default router