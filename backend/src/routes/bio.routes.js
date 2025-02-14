import { Router } from "express";
import { updateBio } from "../controllers/updatebio.controller.js";
import { authenticateUser } from "../middlewares/auth.js";
const router = Router();

router.route('/bio').patch(authenticateUser, updateBio)


export default router