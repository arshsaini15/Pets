import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "./NavBar.jsx"
import "./MainPage.css"

const MainPage = () => {
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [connections, setConnections] = useState([])
    const [pets, setPets] = useState([])
    const navigate = useNavigate()

    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId") || ""

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            console.log('User profile data:', response.data)
            setConnections(response.data.connections)

            // Fetch user list after the profile data
            return axios.get("http://localhost:8000/api/v1/users/fetchpeople", {
                headers: { Authorization: `Bearer ${token}` },
            })
        })
        .then((response) => {
            setUsers(response.data)
            setLoading(false)
        })
        .catch((error) => {
            setError(error);
            setLoading(false);
        })
    }, [token])

    useEffect(() => {
        if (connections.length > 0) {
            axios.get('http://localhost:8000/api/v1/pets/connectionpets', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                if (response.data) {
                    console.log('Pets data:', response.data);
                    setPets(response.data);
                } else {
                    console.log('No pets data found.');
                    setPets([]); // Handle case when no pets data is found
                }
            })
            .catch((error) => {
                console.error("Error fetching pets:", error);
                setPets([]); // Ensure pets is an empty array if there's an error
            });
        } else {
            setPets([]);
        }
    }, [connections, token]);
    

    const handleConnect = async (targetUserId) => {
        const isConnected = connections.includes(targetUserId)
        const url = isConnected ? "disconnect" : "connect"

        try {
            await axios.post(
                `http://localhost:8000/api/v1/users/${url}`,
                { userId: targetUserId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setConnections((prev) => 
                isConnected ? prev.filter((id) => id !== targetUserId) : [...prev, targetUserId]
            )
        } catch (error) {
            console.error(`Error ${isConnected ? "disconnecting" : "connecting"}:`, error)
        }
    }

    const addToListAndNavigate = async (chatUserId) => {
        try {
            await axios.post("http://localhost:8000/api/v1/chats/addtolist", { chatUserId }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            navigate(`/chat/${chatUserId}`)
        } catch (error) {
            console.error("Error adding user to chat list:", error)
        }
    }

    return (
        <div>
            <Navbar />
            <div className="users-container">
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error.message}</p>}

                <div className="user-list">
                    {users.map((user) => (
                        <div key={user._id} className="user-item">
                            <img
                                src={user.profileImage || "default-avatar.png"}
                                alt={user.username}
                                className="user-image"
                            />
                            <h2>{user.username}</h2>
                            <p>{user.bio}</p>
                            <button 
                                onClick={() => handleConnect(user._id)} 
                                className={connections.includes(user._id) ? "connected" : "connect-button"}
                            >
                                {connections.includes(user._id) ? "Connected" : "Connect"}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="posts-container">
                    <h2>Posts from Your Connections</h2>
                    {pets.length > 0 ? (
                        <div className="post-list">
                            {pets.map((post) => (
                                <div key={post._id} className="post-item">
                                <div className="post-author">
                                    <img
                                        src={post.owner?.profileImage || "default-avatar.png"}
                                        alt={post.owner?.username || "Unknown User"}
                                        className="post-author-image"
                                    />
                                    <h3>{post.owner?.username || "Unknown User"}</h3>
                                    <button className="chat-button" onClick={() => addToListAndNavigate(post.owner._id)}>💬</button>
                                </div>
                                {post.caption && <p className="post-caption">{post.caption}</p>}
                                <div className="pet-content">
                                    {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
                                    <div className="pet-details">
                                        <h2>Status: {post.adoptionStatus}</h2>
                                        <h2>Name: {post.name}</h2>
                                        <h2>Age: {post.age}</h2>
                                        <h2>Breed: {post.breed}</h2>
                                        <h2>About: {post.description}</h2>
                                    </div>
                                </div>
                            </div>
                            
                            ))}
                        </div>
                    ) : (
                        <p>No posts available from your connections.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MainPage