import { useState, useEffect } from 'react'
import axios from 'axios'
import './CartPage.css'

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/api/v1/cart/showcart", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItems(response.data.cartItems);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching cart:", err);
                setError("Failed to fetch cart. Please try again later.");
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!address.trim()) {
            alert("Please enter your address before proceeding.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:8000/api/v1/cart/checkout",
                { address },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Order placed successfully!");
            setCartItems([]); // Clear cart after successful checkout
        } catch (err) {
            console.error("Error during checkout:", err);
            alert("Failed to place order. Please try again.");
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8000/api/v1/cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCartItems(cartItems.filter(item => item.product._id !== productId));
            alert("Item removed from cart!");
        } catch (err) {
            console.error("Error removing item from cart:", err);
            alert("Failed to remove item. Please try again.");
        }
    };

    return (
        <div>
            <div className="cart-container">
                <h1>Your Cart 🛒</h1>
                {loading ? (
                    <p>Loading cart items...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : cartItems.length > 0 ? (
                    <>
                        <div className="cart-list">
                            {cartItems.map(item => (
                                <div key={item.product._id} className="cart-item">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="cart-image"
                                    />
                                    <div className="cart-details">
                                        <h2>{item.product.name}</h2>
                                        <p><strong>Price:</strong> ₹{item.product.price}</p>
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                        <button 
                                            className="remove-button" 
                                            onClick={() => handleRemoveFromCart(item.product._id)}
                                        >
                                            🗑️ Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order-summary">
                            <h2>Order Summary</h2>
                            <p><strong>Total Items:</strong> {cartItems.length}</p>
                            <p><strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="address-section">
                            <h2>Delivery Address</h2>
                            <textarea
                                className="address-input"
                                placeholder="Enter your delivery address..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <button className="checkout-button" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </>
                ) : (
                    <p className="empty-cart">Your cart is empty.</p>
                )}
            </div>
        </div>
    )
}

export default CartPage