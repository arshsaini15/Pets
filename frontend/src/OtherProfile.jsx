import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "./NavBar.jsx"
import "./OtherProfile.css"

const OtherProfile = () => {
    const { userId } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token")

                const profileResponse = await axios.get(`http://localhost:8000/api/v1/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                })

                const postsResponse = await axios.get(`http://localhost:8000/api/v1/users/getuserposts/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                })

                setUserProfile(profileResponse.data)
                setUserPosts(postsResponse.data)
            } catch (error) {
                setError("Failed to load the profile. Please try again.")
            } finally {
                setLoading(false)
            }
        };

        fetchUserProfile()
    }, [userId])

    if (loading) return <p>Loading profile...</p>
    if (error) return <p className="error">{error}</p>

    return (
        <div>
            <Navbar />
            <div className="other-profile-container">
                {userProfile ? (
                    <div className="profile-card">
                        <img src={userProfile.profileImage} alt={userProfile.username} className="profile-image" />
                        <h2>{userProfile.username}</h2>
                        <p><strong>Bio:</strong> {userProfile.bio}</p>
                        <p><strong>Connections:</strong> {userProfile.connections.length}</p>
                        <div className="other-profile-actions">
                        <button
                            onClick={() => navigate(`/chat/${userId}`)}
                            className="message-btn"
                            >
                            Message
                        </button>
                        </div>

                        <div className="user-posts">
                            <h3>Posts</h3>
                            {userPosts.length > 0 ? (
                                userPosts.map((post) => (
                                    <div key={post._id} className="post-card">
                                        <p><strong>Caption:</strong> {post.caption}</p>
                                        {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
                                    </div>
                                ))
                            ) : (
                                <p>No posts yet.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>User not found.</p>
                )}
            </div>
        </div>
    )
}

export default OtherProfile