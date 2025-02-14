import { Router } from "express"
import { addComment } from "../controllers/discusscomments.controllers.js"
import { authenticateUser } from "../middlewares/auth.js"

const router = Router();

router.post("/comment/:id", authenticateUser, addComment)

export default router