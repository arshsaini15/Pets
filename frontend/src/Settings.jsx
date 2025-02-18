import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar.jsx";
import "./Settings.css";

const SettingsPage = () => {
    const [userData, setUserData] = useState({
        username: "",
        bio: "",
        profileImage: "",
    });

    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/api/v1/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setUserData(response.data);
            } catch (err) {
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const [newEmail, setNewEmail] = useState("");

const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
            "http://localhost:8000/api/v1/users/update-email",
            { newEmail },
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            }
        );
        alert(response.data.message);
    } catch (err) {
        setError("Failed to update email.");
    }
};


    const handleSignOut = async () => {
        try {
            await axios.post(
                "http://localhost:8000/api/v1/users/logout",
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    withCredentials: true,
                }
            );

            localStorage.clear();
            navigate("/signin");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.patch("http://localhost:8000/api/v1/users/update-username", { newUsername: userData.username }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            alert("Username updated successfully!");
        } catch (err) {
            setError("Failed to update username.");
        }
    };

    const handleBioUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.patch("http://localhost:8000/api/v1/users/update-bio", { newBio: userData.bio }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            alert("Bio updated successfully!");
        } catch (err) {
            setError("Failed to update bio.");
        }
    };

    const handleProfileImageUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("profileImage", newProfileImage);

            await axios.patch("http://localhost:8000/api/v1/users/update-profile-image", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "multipart/form-data" 
                },
                withCredentials: true,
            });
            alert("Profile photo updated successfully!");
        } catch (err) {
            setError("Failed to update profile photo.");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                "http://localhost:8000/api/v1/users/change-password",
                { currentPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            alert("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setError("Failed to change password.");
        }
    };

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="settings-page">
                <h1>Settings</h1>

                {error && <div className="error-message">{error}</div>}

                <div className="settings-section">
                    <h2 onClick={() => toggleSection("username")}>Edit Username</h2>
                    {activeSection === "username" && (
                        <form onSubmit={handleUsernameUpdate}>
                            <input
                                type="text"
                                value={userData.username}
                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                required
                            />
                            <button type="submit">Update Username</button>
                        </form>
                    )}
                </div>

                <div className="settings-section">
                    <h2 onClick={() => toggleSection("bio")}>Edit Bio</h2>
                    {activeSection === "bio" && (
                        <form onSubmit={handleBioUpdate}>
                            <textarea
                                value={userData.bio}
                                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                            />
                            <button type="submit">Update Bio</button>
                        </form>
                    )}
                </div>

                <div className="settings-section">
                    <h2 onClick={() => toggleSection("email")}>Change Email</h2>
                    {activeSection === "email" && (
                        <form onSubmit={handleEmailChange}>
                            <input 
                                type="email" 
                                placeholder="New Email" 
                                value={newEmail} 
                                onChange={(e) => setNewEmail(e.target.value)} 
                                required 
                            />
                            <button type="submit">Update Email</button>
                        </form>
                    )}
                </div>

                <div className="settings-section">
                    <h2 onClick={() => toggleSection("profilePhoto")}>Change Profile Photo</h2>
                    {activeSection === "profilePhoto" && (
                        <form onSubmit={handleProfileImageUpdate}>
                            <input type="file" accept="image/*" onChange={(e) => setNewProfileImage(e.target.files[0])} />
                            {userData.profileImage && <img src={userData.profileImage} alt="Profile" className="profile-image-preview" />}
                            <button type="submit">Update Profile Photo</button>
                        </form>
                    )}
                </div>

                <div className="settings-section">
                    <h2 onClick={() => toggleSection("password")}>Change Password</h2>
                    {activeSection === "password" && (
                        <form onSubmit={handlePasswordChange}>
                            <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            <button type="submit">Change Password</button>
                        </form>
                    )}
                </div>

                <div className="settings-section">
                    <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;