import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './NavBar.jsx';
import './ItemPage.css';

const ItemPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/admin/products/fetch")
                setProducts(response.data)
                setLoading(false)
            } catch (err) {
                console.error("Error fetching products:", err)
                setError("Failed to fetch products. Please try again later.")
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    return (
        <div>
            <Navbar />
            <div className="products-container">
                <h1>Available Products</h1>
                <button className="cart-btn" onClick={() => navigate('/cart')}>
                    🛒 Go to Cart
                </button>
                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : products.length > 0 ? (
                    <div className="product-list">
                        {products.map(product => (
                            <div 
                                key={product._id} 
                                className="product-item" 
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <img src={product.imageUrl} alt={product.name} className="product-image" />
                                <h2>{product.brand}</h2>
                                <p>{product.name}</p>
                                <p><strong>Price:</strong> ₹{product.price}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No products available.</p>
                )}
            </div>
        </div>
    )
}

export default ItemPage