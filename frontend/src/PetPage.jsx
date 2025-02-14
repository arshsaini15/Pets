import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './PetPage.css'

const PetGallery = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

        setPets(res.data)
      } catch (err) {
        setError('Failed to fetch pets. Please try again later.')
        console.error('Error fetching pets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [token])

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
    <div className="pet-gallery-container">
      <h1 className="pet-gallery-heading">Adorable Pets</h1>

      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="pet-grid">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet._id} className="pet-item" onClick={() => handlePetClick(pet._id)}>
              <img src={pet.imageUrl || 'default-image-url.jpg'} alt={pet.name} className="pet-thumbnail" />
              <h3 className="pet-title">{pet.name}</h3>
              <p className="pet-category">{pet.breed || 'Unknown Breed'}</p>
              {/* <p className="pet-age-info">{pet.age} years old</p> */}
              {/* <p className="pet-summary">{pet.description}</p> */}
              <button className="chat-button" onClick={(e) => { e.stopPropagation(); addToListAndNavigate(pet._id); }}>
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

export default PetGallery