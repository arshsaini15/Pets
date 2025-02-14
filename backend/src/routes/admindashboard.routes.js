import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { adminProducts } from "../controllers/adminproducts.controller.js";
const router = Router();

// POST: Add a new product
router.post("/products", upload.single('imageUrl'), adminProducts)

export default router;