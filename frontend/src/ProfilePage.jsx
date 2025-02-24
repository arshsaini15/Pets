import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import './ProfilePage.css'

const ProfilePage = () => {
    const [profileImage, setProfileImage] = useState(null)
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [posts, setPosts] = useState("")
    const [connections, setConnections] = useState(0)
    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showTextarea, setShowTextarea] = useState(false)

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

                setProfileImage(response.data.profileImage)
                setUsername(response.data.username)
                setBio(response.data.bio || "")
                setConnections(response.data.connections)

                const postsResponse = await axios.get("http://localhost:8000/api/v1/posts/getposts", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
                setPosts(postsResponse.data)
                const petsResponse = await axios.get("http://localhost:8000/api/v1/pets/getpets", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
                setPets(petsResponse.data)

                setLoading(false)
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handlePetClick = (petId) => {
        navigate(`/pets/${petId}`)
    }
      
    const handleDelete = async (petId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this pet?");
        if (!confirmDelete) return;

        console.log('confirmed') 
        
        const res = await axios.delete('http://localhost:8000/api/v1/pets/getpets', {
            data: {petId},
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
        })

        console.log(res.data.message);
        setPets(pets.filter(pet => pet._id !== petId));
    }

    const addPost = () => {
        navigate('/addpost')
    }

    const fetchConnections = () => {
        navigate('/connections')
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <>
            <div className="profile">
                <div className="profile-content">
                    <div className="user-info">
                        <div className="header">
                            <h1>Welcome, {username}!</h1>
                            {profileImage ? (
                                <img className="profile-image" src={profileImage} alt="Profile" />
                            ) : (
                                <div className="profile-placeholder">No Image</div>
                            )}
                        </div>
                        <div className="bio">
                            {!showTextarea ? (
                                <p>{bio || "Write about yourself!"}</p>
                            ) : (
                                <textarea
                                    className="bio-textarea"
                                    placeholder="Enter your bio..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            )}
                        </div>
                        <div className="connections">
                            <p onClick={fetchConnections}><strong>Connections:</strong> {connections.length}</p>
                        </div>
                    </div>

                    <div className="posts-section">
                        <button onClick={addPost} className="add-post-btn">Add Post</button>

                        <div className="pets-list">
                            <h3>Your Pets</h3>
                            {pets.length > 0 ? (
                                pets.map(pet => (
                                    <div key={pet._id} className="pet-card">
                                        <FaTrash className="delete-icon" onClick={() => handleDelete(pet._id)} />
                                        <p><strong>Name:</strong> {pet.name}</p>
                                        <p><strong>Species:</strong> {pet.species}</p>
                                        <p><strong>Age:</strong> {pet.age}</p>
                                        {pet.imageUrl && <img src={pet.imageUrl} alt="Pet" className="pet-image" onClick={() => handlePetClick(pet._id)} />}
                                    </div>
                                ))
                            ) : (
                                <p>No pets yet!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage