import { Router } from "express"
import { Product } from "../models/product.models.js"
const router = Router()

router.delete("/products/:id", async(req, res) => {
    const { id } = req.params

    try {
        const product = await Product.findByIdAndDelete(id)
        if(!product){
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ message: "Product deleted successfully" })
    } catch(error) {
        console.log("error deleting product: ", error)
        res.status(500).json({ message: "Server error" })
    }
})

export default router