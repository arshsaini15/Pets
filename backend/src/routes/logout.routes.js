import { Router } from "express";
import { logoutUser } from "../controllers/logout.controller.js";

const router = Router();

router.route("/logout").post(logoutUser);

export default router;