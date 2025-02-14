import { asyncHandler } from '../utils/asyncHandler.js'
import { Product } from '../models/product.models.js'
import { Cart } from '../models/cart.models.js'

export const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body
    const userId = req.userId

    const product = await Product.findById(productId)
    if (!product) {
        res.status(404)
        throw new Error('Product not found')
    }

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
        cart = new Cart({ user: userId, products: [] })
    }

    const existingProduct = cart.products.find(item => item.product.toString() === productId)

    if (existingProduct) {
        existingProduct.quantity += 1
    } else {
        cart.products.push({ product: productId, quantity: 1 })
    }

    await cart.save()

    res.status(200).json({ message: 'Product added to cart', cart })
})
