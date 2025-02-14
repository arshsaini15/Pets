import { Router } from "express"
import { authenticateUser } from '../middlewares/auth.js'
import { createPost } from '../controllers/createPost.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
const router = Router()

router.post('/createpost', upload.single('image'), authenticateUser, createPost)

export default router