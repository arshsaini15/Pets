import { Product } from '../models/product.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getProductDetails = asyncHandler( async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId)

        if (!product) {
            console.log('not found')
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json(product)
    } catch (error) {
        console.error('Error fetching product details:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})