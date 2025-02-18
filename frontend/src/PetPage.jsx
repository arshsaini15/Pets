import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './PetPage.css'

const PetPage = () => {
  const [pets, setPets] = useState([])
  const [nearbyPets, setNearbyPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/pets/allpets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('Fetched Pets:', res.data) // Debugging

        if (Array.isArray(res.data)) {
          setPets(res.data)
        } else {
          setError('Unexpected response from server')
        }
      } catch (err) {
        setError('Failed to fetch pets. Please try again later.')
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
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/pets/nearby?lat=${latitude}&lon=${longitude}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
  
          console.log('Nearby Pets:', res.data)
  
          if (Array.isArray(res.data.data)) {
            setNearbyPets(res.data.data) // Extracting pets from response
          } else {
            setError('Unexpected response from server')
          }
        } catch (err) {
          setError('Failed to fetch nearby pets. Please try again later.')
          console.error('Error fetching nearby pets:', err)
        }
      },
      () => {
        setLocationError('Unable to retrieve your location.')
      }
    )
  }
  
  const addToListAndNavigate = async (chatUserId) => {
    try {
      if (!chatUserId) {
        throw new Error('chatUserId is required')
      }

      await axios.post('http://localhost:8000/api/v1/chats/addtolist', { chatUserId }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      navigate(`/chat/${chatUserId}`)
    } catch (error) {
      console.error('Error adding user to chat list:', error)
    }
  }

  const handlePetClick = (petId) => {
    navigate(`/pets/${petId}`)
  }

  return (
    <div className="pet-page-container">
      <h1 className="pet-page-heading">Find Your Perfect Pet</h1>
      <button className="nearby-pets-btn" onClick={fetchNearbyPets}>Show Pets Near Me</button>

      {locationError && <div className="error-message">{locationError}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Nearby Pets Section */}
      {nearbyPets.length > 0 && (
        <div className="nearby-pets-section">
          <h2 className="section-heading">Pets Near You</h2>
          <div className="pet-grid">
            {nearbyPets.map((pet) => (
              <div key={pet._id} className="pet-item" onClick={() => handlePetClick(pet._id)}>
                <img src={pet.imageUrl || 'default-image-url.jpg'} alt={pet.name} className="pet-thumbnail" />
                <h3 className="pet-title">{pet.name}</h3>
                <p className="pet-category">{pet.breed || 'Unknown Breed'}</p>
                <button className="chat-button" onClick={(e) => { e.stopPropagation(); addToListAndNavigate(pet.owner); }}>
                  Contact Owner
                </button>
              </div>
            ))}
          </div>
        </div>

      )}
      <h2 className="section-heading">All Pets</h2>
      <div className="pet-grid">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet._id} className="pet-item" onClick={() => handlePetClick(pet._id)}>
              <img src={pet.imageUrl || 'default-image-url.jpg'} alt={pet.name} className="pet-thumbnail" />
              <h3 className="pet-title">{pet.name}</h3>
              <p className="pet-category">{pet.breed || 'Unknown Breed'}</p>
              <button className="chat-button" onClick={(e) => { e.stopPropagation(); addToListAndNavigate(pet.owner); }}>
                Contact Owner
              </button>
            </div>
          ))
        ) : (
          <div className="no-pets-message">No pets available.</div>
        )}
      </div>
    </div>
  )
}

export default PetPage