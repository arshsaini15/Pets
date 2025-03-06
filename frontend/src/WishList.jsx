"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./WishList.css"

const WishList = () => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/pets/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setWishlist(res.data.favourites)
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [token])

  const removeFromWishlist = async (petId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/pets/removewishlist/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setWishlist((prevWishlist) => prevWishlist.filter((pet) => pet._id !== petId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  
  const handlePetClick = (petId) => {
    navigate(`/pets/${petId}`)
  }

  return (
    <div className="wishlist-container">
      <button className="back-to-pets" onClick={() => navigate("/pets")}>
        ← Back to Pets
      </button>
      <h1>My Wishlist</h1>
      {loading ? (
        <p>Loading wishlist...</p>
      ) : wishlist.length === 0 ? (
        <p>No pets in wishlist. Add some pets to your wishlist!</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((pet) => (
            <div key={pet._id} className="wishlist-item" onClick={() => handlePetClick(pet._id)}>
              <img src={pet.imageUrl || "default-image-url.jpg"} alt={pet.name} className="wishlist-thumbnail" />
              <h3>{pet.name}</h3>
              <button onClick={() => removeFromWishlist(pet._id)}>❌ Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishList