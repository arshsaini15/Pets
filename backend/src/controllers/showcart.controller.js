import { asyncHandler } from '../utils/asyncHandler.js'
import { Cart } from '../models/cart.models.js'

export const showCart = asyncHandler(async (req, res) => {
    const userId = req.userId

    const cart = await Cart.findOne({ user: userId }).populate('products.product', 'name price imageUrl')

    if (!cart || cart.products.length === 0) {
        console.log('cart is empty')
        return res.status(404).json({ message: "Your cart is empty." })
    }

    res.status(200).json({ cartItems: cart.products })
})