import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProduct(response.data);
                // Set page title dynamically
                document.title = `${response.data.name} | Pet Items`;
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError("Failed to fetch product details. Please try again.");
                if (err.response && err.response.status === 401) {
                    navigate('/login', { state: { from: `/product/${id}` } });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
        
        // Cleanup function
        return () => {
            document.title = "Pet Shop"; // Reset title on component unmount
        };
    }, [id, navigate]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/login', { state: { from: `/product/${id}` } });
                return;
            }
            
            await axios.post(
                "http://localhost:8000/api/v1/cart/addtocart",
                { productId: product._id, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.textContent = `${product.name} added to cart!`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => document.body.removeChild(notification), 300);
                }, 2000);
            }, 10);
            
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add product to cart.");
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="product-details-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-details-container">
                <div className="error-message">
                    <h2>Oops!</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')}>Return to Home</button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-container">
                <div className="error-message">
                    <h2>Product Not Found</h2>
                    <p>We couldn't find the product you're looking for.</p>
                    <button onClick={() => navigate('/')}>Browse Products</button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-details-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>
            
            <div className="product-details">
                <div className="product-gallery">
                    <div className="product-image-wrapper">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="product-image" 
                        />
                        {product.inStock === false && (
                            <div className="out-of-stock-overlay">
                                <span>Out of Stock</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="product-info">
                    <div className="product-header">
                        <span className="product-brand">{product.brand}</span>
                        <span className="product-name">{product.name}</span>
                    </div>
                    
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-price">
                        <strong>₹{product.price.toLocaleString()}</strong>
                        {product.originalPrice && (
                            <div className="discount-container">
                                <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                                <span className="discount-badge">
                                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="quantity-selector">
                        <label htmlFor="quantity">Quantity:</label>
                        <div className="quantity-controls">
                            <button 
                                className="quantity-btn"
                                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <input 
                                id="quantity"
                                type="number" 
                                min="1"
                                value={quantity} 
                                onChange={handleQuantityChange}
                                aria-label="Product quantity"
                            />
                            <button 
                                className="quantity-btn"
                                onClick={() => setQuantity(quantity + 1)}
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    
                    <div className="product-actions">
                        <button 
                            className={`add-to-cart-btn ${product.inStock === false ? 'disabled' : ''}`}
                            onClick={handleAddToCart}
                            disabled={addingToCart || product.inStock === false}
                        >
                            {addingToCart ? 'Adding...' : product.inStock === false ? 'Out of Stock' : '🛒 Add to Cart'}
                        </button>

                        <button className="go-to-cart-btn" onClick={() => navigate("/cart")}>
                            🛍️ Go to Cart
                        </button>
                    </div>
                    
                    {product.features && product.features.length > 0 && (
                        <div className="product-features">
                            <h3>Features</h3>
                            <ul>
                                {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPage