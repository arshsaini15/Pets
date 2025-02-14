import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const response = await axios.get("http://localhost:8000/api/v1/admin/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                console.log('response is: ',response);
                
                setProfileImage(response.data.profileImage);
                setUsername(response.data.username);

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="profile-page">
            <h1 className="welcome-message">Welcome, {username}!</h1>
            {profileImage ? (
                <img
                    className="profile-image"
                    src={profileImage}
                    alt="Profile"
                />
            ) : (
                <div className="profile-placeholder">No Image</div>
            )}

            <p 
                className="linkTag" 
                onClick={() => navigate('/dashboard')}
                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
            >
                Go to Dashboard
            </p>


        </div>
    );
};

export default HomePage;