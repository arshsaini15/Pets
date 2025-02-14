import { Router } from 'express'
import Product from '../models/product.models.js'
const router = Router()

router.get('/products', async(req, res) => {
    try {
        const products = await Product.find()
        res.json(products);
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Error fetching products' });
    }
})

export default router