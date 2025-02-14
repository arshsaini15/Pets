import express from "express";
import { getProfileImage } from "../controllers/getprofile.controller.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/profile").get(authenticateUser, getProfileImage)

export default router;