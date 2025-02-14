import { Router } from "express";
import { Product } from "../models/product.models.js"
const router = Router();

// GET: Fetch all products
router.get("/products/fetch", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error });
    }
});

export default router