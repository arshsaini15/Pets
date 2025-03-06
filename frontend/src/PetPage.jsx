import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './PetPage.css'

const PetPage = () => {
  const [pets, setPets] = useState([])
  const [nearbyPets, setNearbyPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState(null)
  const [showNearby, setShowNearby] = useState(false)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const res = await axios.get('http://localhost:8000/api/v1/pets/allpets', {
          headers: {
            Authorization: `Bearer ${token}`,
            userId,
          },
        })

        setPets(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error('Error fetching pets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [token])

  const fetchNearbyPets = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }

    setShowNearby((prevShowNearby) => {
      if (!prevShowNearby) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            try {
              const res = await axios.get(
                `http://localhost:8000/api/v1/pets/nearby?lat=${latitude}&lon=${longitude}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )

              setNearbyPets(Array.isArray(res.data.data) ? res.data.data : [])
            } catch (err) {
              console.error('Error fetching nearby pets:', err)
            }
          },
          () => {
            setLocationError('Unable to retrieve your location.')
          }
        )
      }
      return !prevShowNearby
    })
  }

  const handleWishlist = async (petId) => {
    try {
      await axios.post(
        'http://localhost:8000/api/v1/pets/wishlist',
        { petId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Pet added to wishlist!')
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    }
  }

  const handlePetClick = (petId) => {
    navigate(`/pets/${petId}`)
  }

  return (
    <div className="pet-page-container">
      <div className="top-buttons">
        <button className="wishlist-page-btn" onClick={() => navigate('/wishlist')}>
          ❤️ Wishlist
        </button>
        <button className="nearby-pets-btn" onClick={fetchNearbyPets}>
          {showNearby ? 'Show All Pets' : 'Show Pets Near Me'}
        </button>
      </div>

      {locationError && <div className="error-message">{locationError}</div>}
      {loading && <div className="loading-message">Loading...</div>}

      {showNearby ? (
        nearbyPets.length > 0 ? (
          <div className="pet-grid">
            {nearbyPets.map((pet) => (
              <div key={pet._id} className="pet-item" onClick={() => handlePetClick(pet._id)}>
                <img src={pet.imageUrl || 'default-image-url.jpg'} alt={pet.name} className="pet-thumbnail" />
                <h3 className="pet-title">{pet.name}</h3>
                <p className="pet-location">{pet.location?.address || 'Location not available'}</p>
                <button
                  className="wishlist-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleWishlist(pet._id)
                  }}
                >
                  ❤️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-pets-message">No nearby pets found.</div>
        )
      ) : (
        <div className="pet-grid">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet._id} className="pet-item" onClick={() => handlePetClick(pet._id)}>
                <img src={pet.imageUrl || 'default-image-url.jpg'} alt={pet.name} className="pet-thumbnail" />
                <h3 className="pet-title">{pet.name}</h3>
                <button
                  className="wishlist-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleWishlist(pet._id)
                  }}
                >
                  ❤️
                </button>
              </div>
            ))
          ) : (
            <div className="no-pets-message">No pets found.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default PetPage
