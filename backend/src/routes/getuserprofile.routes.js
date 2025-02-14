import express from "express";
import { getUserProfile } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/profile/:id", getUserProfile);

export default router;