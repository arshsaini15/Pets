import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './PetProfile.css';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PetProfile = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const selfId = localStorage.getItem('userId');

  useEffect(() => {
    if (!petId) return;
    const fetchPetDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/pets/${petId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleBack = () => navigate(-1);

  const addToListAndNavigate = async (chatUserId) => {
    if (!chatUserId) return alert("Invalid owner ID.");
    try {
      await axios.post(
        'http://localhost:8000/api/v1/chats/addtolist',
        { chatUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/chat/${chatUserId}`);
    } catch (error) {
      console.error('Error adding user to chat list:', error);
      setError('Failed to add to chat list. Please try again later.');
    }
  };

  const chatWithOwner = () => {
    if (!pet?.owner?._id) return alert("Owner information is missing.");
    if (selfId === pet.owner._id) return alert("You can't chat with yourself.");
    addToListAndNavigate(pet.owner._id);
  };

  const petIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
  });

  return (
    <div className="pet-profile-container">
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {pet && (
        <div className="pet-profile-card">
          {pet.owner && (
            <h1 
              onMouseOver={(e) => (e.target.style.cursor = "pointer")} 
              onClick={() => navigate(`/profile/${pet.owner._id}`)}
              className="pet-owner-name"
            >
              {pet.owner.username}'s Pet
            </h1>
          )}

          <div className="pet-image-container">
            <img 
              src={pet.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image+Available'} 
              alt={pet.name} 
              className="pet-thumbnail" 
            />
          </div>

          <div className="pet-details">
            <h2 className="pet-title">{pet.name}</h2>
            <p className="pet-category">{pet.breed || 'Unknown Breed'}</p>
            <p className="pet-age-info">{pet.age} years old</p>
            <p className="pet-summary">{pet.description || 'No description available'}</p>

            <button className="contact-owner-btn" onClick={chatWithOwner}>
              Contact Owner
            </button>
          </div>

          <div className="pet-location-wrapper">
            <h3>Pet's Location</h3>
            {pet.location?.coordinates?.length === 2 ? (
              <MapContainer
                center={[pet.location.coordinates[1], pet.location.coordinates[0]]}
                zoom={13}
                className="pet-map"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[pet.location.coordinates[1], pet.location.coordinates[0]]}
                  icon={petIcon}
                >
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{pet.name}</strong> is here! 📍
                      <p>Meet this {pet.breed || 'wonderful pet'}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>{pet.location?.address || 'Location not available'}</p>
            )}
          </div>

          <button  className="back-btn" onClick={handleBack}>Back to Pets</button>
        </div>
      )}
    </div>
  );
};

export default PetProfile;