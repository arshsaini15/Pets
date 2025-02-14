import { Router } from "express";
import { signedUser } from "../controllers/signin.controller.js"

const router = Router()

router.route("/signin").post(signedUser)

export default router