import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OtherProfile.css";

const OtherProfile = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [profileError, setProfileError] = useState(null);
    const [postsError, setPostsError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                // Fetch user profile
                const profileResponse = await axios.get(
                    `http://localhost:8000/api/v1/users/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setUserProfile(profileResponse.data);
            } catch (error) {
                setProfileError("Failed to load user profile.");
            } finally {
                setLoading(false);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const token = localStorage.getItem("token");

                // Fetch user posts
                const postsResponse = await axios.get(
                    `http://localhost:8000/api/v1/users/getuserposts/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setUserPosts(postsResponse.data);
            } catch (error) {
                setPostsError("User hasn't posted anything yet.");
            }
        };

        fetchUserProfile();
        fetchUserPosts();
    }, [userId]);

    if (loading) return <p>Loading profile...</p>;
    if (profileError) return <p className="error">{profileError}</p>;

    return (
        <div>
            <div className="other-profile-container">
                {userProfile ? (
                    <div className="profile-card">
                        <img
                            src={userProfile.profileImage}
                            alt={userProfile.username}
                            className="profile-image"
                        />
                        <h2>{userProfile.username}</h2>
                        <p>
                            <strong>Bio:</strong> {userProfile.bio}
                        </p>
                        <p>
                            <strong>Connections:</strong> {userProfile.connections.length}
                        </p>
                        <div className="other-profile-actions">
                            <button
                                onClick={() => navigate(`/chat/${userId}`)}
                                className="message-btn"
                            >
                                Message
                            </button>
                        </div>

                        {/* Show posts only if available */}
                        <div className="user-posts">
                            <h3>Posts</h3>
                            {postsError ? (
                                <p className="error">{postsError}</p>
                            ) : userPosts.length > 0 ? (
                                userPosts.map((post) => (
                                    <div key={post._id} className="post-card">
                                        <p>
                                            <strong>Caption:</strong> {post.caption}
                                        </p>
                                        {post.imageUrl && (
                                            <img
                                                src={post.imageUrl}
                                                alt="Post"
                                                className="post-image"
                                            />
                                        )}
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
    );
};

export default OtherProfile;
