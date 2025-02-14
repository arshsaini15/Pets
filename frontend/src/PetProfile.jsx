import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PetProfile.css';

const PetProfile = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/pets/${petId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setPet(res.data);
      } catch (err) {
        setError('Failed to fetch pet details. Please try again later.');
        console.error('Error fetching pet details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [petId, token]);

  const handleBack = () => {
    navigate(-1);
  };

  const addToListAndNavigate = async (chatUserId) => {
    try {
      if (!chatUserId) {
        throw new Error('chatUserId is required');
      }

      await axios.post(
        'http://localhost:8000/api/v1/chats/addtolist',
        { chatUserId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      navigate(`/chat/${chatUserId}`)
    } catch (error) {
      console.error('Error adding user to chat list:', error);
      alert('Failed to add to chat list. Please try again later.');
    }
  };

  const chatWithOwner = () => {
    const chatUserId = pet.owner
    const selfId = localStorage.getItem('userId')

    if(!(selfId === chatUserId._id)) {
        if (chatUserId) {
            addToListAndNavigate(chatUserId)
        } else {
            console.error('Owner ID not available')
        }
    } else {
        alert("you can't chat with yourself")
    }
  }

  return (
    <div className="pet-profile-container">
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {pet && (
        <div className="pet-profile-card">
          <h1 
                onMouseOver={(e) => (e.target.style.cursor = "pointer")} 
                onClick={() => navigate(`/profile/${pet.owner._id}`)}
                >
                {pet.owner.username}
            </h1>

          <div className="pet-image-container">
            <img src={pet.imageUrl || 'default-image-url.jpg'} alt={pet.name} className="pet-thumbnail" />
          </div>

          <div className="pet-details">
            <h2 className="pet-title">{pet.name}</h2>
            <p className="pet-category">{pet.breed || 'Unknown Breed'}</p>
            <p className="pet-age-info">{pet.age} years old</p>
            <p className="pet-summary">{pet.description || 'No description available'}</p>

            <div className="pet-contact">
              <button className="contact-owner-btn" onClick={chatWithOwner}>
                Contact Owner
              </button>
            </div>
          </div>
          
          <button className="back-btn" onClick={handleBack}>
            Back to Pets
          </button>
        </div>
      )}
    </div>
  )
}

export default PetProfile