import { asyncHandler } from '../utils/asyncHandler.js'
import { Product } from '../models/product.models.js'
import { Cart } from '../models/cart.models.js'

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body
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
        existingProduct.quantity = Math.min(existingProduct.quantity + quantity, 20) // Max 20 items
    } else {
        cart.products.push({ product: productId, quantity: Math.min(quantity, 20) }) // Ensure new product follows the limit
    }

    await cart.save()
    res.status(200).json({ message: 'Product added to cart', cart })
})

export const decreaseAmount = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const userId = req.userId

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' })
    }

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId)

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' })
    }

    if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1
    } else {
        cart.products.splice(productIndex, 1)
    }

    await cart.save()
    res.status(200).json({ message: 'Product quantity updated', cart })
})

export const increaseAmount = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.userId;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Prevent increasing quantity beyond 20
    if (cart.products[productIndex].quantity < 20) {
        cart.products[productIndex].quantity += 1;
        await cart.save();
        res.status(200).json({ message: 'Product quantity increased', cart });
    } else {
        res.status(400).json({ message: 'Maximum quantity limit reached (20)' });
    }
})

export const deleteFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const userId = req.userId

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' })
    }

    // Filter out the product from the cart
    const updatedProducts = cart.products.filter(item => item.product.toString() !== productId)

    // If no change, product was not in the cart
    if (updatedProducts.length === cart.products.length) {
        return res.status(404).json({ message: 'Product not found in cart' })
    }

    cart.products = updatedProducts
    await cart.save()

    res.status(200).json({ message: 'Product removed from cart', cart })
})