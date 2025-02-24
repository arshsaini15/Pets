import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Connections.css"

const Connections = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [connections, setConnections] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await axios.get("http://localhost:8000/api/v1/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })

                console.log(response.data)
                setConnections(response.data.connections)
                
            } catch (error) {
                setError("Failed to load connections. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    return (
        <div>
            <div className="connections-container">
                <h1>Your Connections 🔗</h1>
                {loading ? (
                    <p>Loading connections...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : connections.length > 0 ? (
                    <div className="connections-list">
                        {connections.map((user) => (
                            <div key={user._id} className="connection-card">
                                <img
                                    src={user.profileImage}
                                    alt={user.username}
                                    className="profile-image"
                                />
                                <h3>{user.username}</h3>
                                <button
                                    className="view-profile"
                                    onClick={() => navigate(`/profile/${user._id}`)}
                                >
                                    View Profile 👤
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No connections yet. Start following people! 😊</p>
                )}
            </div>
        </div>
    );
};

export default Connections