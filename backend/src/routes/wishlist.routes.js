import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const router = Router();

router.get("/wishlist", authenticateUser, getWishlist);
router.post("/wishlist", authenticateUser, addToWishlist);
router.delete("/removewishlist/:petId", authenticateUser, removeFromWishlist);

export default router