import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItemPage.css';

const ItemPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/admin/products/fetch")
                setProducts(response.data)
                setFilteredProducts(response.data)
                setLoading(false)
            } catch (err) {
                console.error("Error fetching products:", err)
                setError("Failed to fetch products. Please try again later.")
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    // Handle search input changes
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        if (term.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(term) || 
                product.brand.toLowerCase().includes(term)
            );
            setFilteredProducts(filtered);
        }
    }

    return (
        <div>
            <div className="products-container">
                <h1>Available Products</h1>
                <div className="top-section">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by brand or product name..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                className="clear-search" 
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilteredProducts(products);
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button className="cart-btn" onClick={() => navigate('/cart')}>
                        🛒 Go to Cart
                    </button>
                </div>

                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : filteredProducts.length > 0 ? (
                    <div className="product-list">
                        {filteredProducts.map(product => (
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
                    <p className="no-results">No products found matching "{searchTerm}".</p>
                )}
            </div>
        </div>
    )
}

export default ItemPage