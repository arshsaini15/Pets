"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./CartPage.css"

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [address, setAddress] = useState("")

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8000/api/v1/cart/showcart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCartItems(response.data.cartItems || [])
    } catch (err) {
      console.error("Error fetching cart:", err)
      setError("Your Cart Is Empty")
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = cartItems?.length
    ? cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
    : 0

    const totalItems = cartItems?.length
  ? cartItems.reduce((total, item) => total + item.quantity, 0)
  : 0;


  const handleRemoveFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:8000/api/v1/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchCart()
    } catch (err) {
      console.error("Error removing item from cart:", err)
      alert("Failed to remove item. Please try again.")
    }
  }

  const handleDecreaseQuantity = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `http://localhost:8000/api/v1/cart/remove/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      fetchCart()
    } catch (err) {
      console.error("Error decreasing quantity:", err)
      alert("Failed to update quantity. Please try again.")
    }
  }

  const handleIncreaseQuantity = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `http://localhost:8000/api/v1/cart/increase/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      fetchCart()
    } catch (err) {
      console.error("Error increasing quantity:", err)
      alert("Failed to update quantity. Please try again.")
    }
  }

  const handleCheckout = async () => {
    if (!address.trim()) {
      alert("Please enter your address before proceeding.")
      return
    }

    let finalAmount = totalPrice * 100 // Convert to paise

    // Razorpay Max Limit Check
    const MAX_RAZORPAY_AMOUNT = 50000000 // ₹5,00,000 in paise
    if (finalAmount > MAX_RAZORPAY_AMOUNT) {
      alert("The total amount exceeds the allowed transaction limit. Please reduce your cart value.")
      return
    }

    console.log("Final amount being sent:", finalAmount)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:8000/api/v1/cart/create-order",
        { address, amount: finalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const { order } = response.data
      if (!order) {
        alert("Failed to create order. Please try again.")
        return
      }

      const options = {
        key: "rzp_test_lnw8y27v4NY3zx",
        amount: order.amount,
        currency: "INR",
        name: "PetAdoption",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          console.log("Payment Successful:", response)
          try {
            await axios.post(
              "http://localhost:8000/api/v1/cart/verify-payment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            alert("Payment successful! Order placed.")
            setCartItems([])
          } catch (err) {
            console.error("Payment verification failed:", err)
            alert("Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: "Arshdeep",
          email: "arshdeepp015@gmail.com",
          contact: "9306403708",
        },
        theme: { color: "#3399cc" },
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Refresh and try again.")
        return
      }

      const razor = new window.Razorpay(options)
      razor.open()
    } catch (err) {
      console.error("Error initiating payment:", err)
      alert("Failed to initiate payment. Please try again.")
    }
  }

  return (
    <div className="cart-container">
      <h1>Your Cart 🛒</h1>
      {loading ? (
        <p className="loading">Loading cart items...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : cartItems.length > 0 ? (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <img 
                  src={item.product.imageUrl || "/placeholder.svg"} 
                  alt={item.product.name} 
                  className="cart-image" 
                />
                <div className="cart-details">
                  <h2>{item.product.name}</h2>
                  <p>
                    <strong>Price:</strong> ₹{item.product.price.toLocaleString("en-IN")}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <div className="cart-buttons">
                    <button
                      className="decrease-button"
                      onClick={() => handleDecreaseQuantity(item.product._id)}
                      aria-label="Decrease quantity"
                    >
                      ➖
                    </button>
                    <button
                      className="decrease-button"
                      onClick={() => handleIncreaseQuantity(item.product._id)}
                      aria-label="Increase quantity"
                    >
                      ➕
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFromCart(item.product._id)}
                      aria-label="Remove from cart"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <h2>Order Summary</h2>
            <p>
                <span>Total Items:</span>
                <span>{totalItems}</span>
            </p>

            <p>
              <span>Total Price:</span>
              <span>
                ₹
                {totalPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
          </div>
          <div className="address-section">
            <h2>Delivery Address</h2>
            <textarea
              className="address-input"
              placeholder="Colony, house no./ office address, city, state..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
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
  )
}

export default CartPage