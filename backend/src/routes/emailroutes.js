import express from "express"
import { requestEmailUpdate, verifyEmailUpdate } from "../controllers/emailController.js"
import { authenticateUser } from "../middlewares/auth.js"

const router = express.Router()

router.patch("/update-email", authenticateUser, requestEmailUpdate)
router.get("/verify-email/:token", verifyEmailUpdate)

export default router