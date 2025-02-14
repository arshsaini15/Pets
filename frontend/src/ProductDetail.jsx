import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./NavBar.jsx";
import "./ProductDetail.css";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError("Failed to fetch product details. Please try again.");
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:8000/api/v1/cart/addtocart",
                { productId: product._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`${product.name} added to cart! 🛒`);
        } catch (error) {
            console.error("Error adding to cart:", error)
            alert("Failed to add product to cart.")
        }
    };

    const handleBuyNow = async () => {
        alert(`Proceeding to buy ${product.name} 🛍️`)
    };

    return (
        <div>
            <Navbar />
            <div className="product-details-container">
                {loading ? (
                    <p>Loading product details...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : product ? (
                    <div className="product-details">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                        <h1>{product.brand}</h1>
                        <h1>{product.name}</h1>
                        <p className="product-description">{product.description}</p>
                        <p><strong>Price:</strong> ₹{product.price}</p>
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                            🛒 Add to Cart
                        </button>
                        <button className="buy-now-btn" onClick={handleBuyNow}>
                            🛍️ Buy Now
                        </button>
                    </div>
                ) : (
                    <p>Product not found.</p>
                )}
            </div>
        </div>
    )
}

export default ProductDetailsPage