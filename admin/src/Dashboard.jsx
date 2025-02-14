import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        brand: "",
        stock: "",
        imageUrl: null, 
    });

    const [products, setProducts] = useState([]);

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/admin/products/fetch");
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageUrl: e.target.files[0] });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }

        try {
            await axios.post(
                "http://localhost:8000/api/v1/admin/products",
                data,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/v1/admin/products/${productId}`);
    
            if (response.status === 200) {
                alert("Product deleted successfully");
                fetchProducts();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete the product.");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/signin");
    };

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <p>Manage your products below.</p>

            <form className="product-form" onSubmit={handleAddProduct}>
                <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} required />
                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
                <input type="file" name="imageUrl" onChange={handleFileChange} required />
                <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleInputChange} />
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInputChange} />
                <button type="submit">Add Product</button>
            </form>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Brand</th>
                        <th>Stock</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.description || "N/A"}</td>
                                <td>
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td>{product.brand || "N/A"}</td>
                                <td>{product.stock}</td>
                                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteProduct(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No products available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;