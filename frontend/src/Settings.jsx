import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const SettingsPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const [userData, setUserData] = useState({
        username: username || "",
        bio: "",
        profileImage: "",
    });

    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(null);
    const [loadingProfileImage, setLoadingProfileImage] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!token) {
                    setError("User not authenticated.");
                    setLoading(false);
                    return;
                }
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
    }, [token]);

    const handleEmailChange = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(
                "http://localhost:8000/api/v1/users/update-email",
                { newEmail },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            alert("Email updated successfully!");
        } catch (err) {
            setError("Failed to update email.");
        }
    };

    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(
                "http://localhost:8000/api/v1/users/update-username",
                { newUsername: userData.username },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            alert("Username updated successfully!");
        } catch (err) {
            setError("Failed to update username.");
        }
    };

    const handleBioUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(
                "http://localhost:8000/api/v1/users/update-bio",
                { newBio: userData.bio },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            alert("Bio updated successfully!");
        } catch (err) {
            setError("Failed to update bio.");
        }
    };

    const handleProfileImageUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoadingProfileImage(true); // Show spinner
    
            const formData = new FormData();
            formData.append("profileImage", newProfileImage);
    
            const response = await axios.patch("http://localhost:8000/api/v1/users/update-profile-image", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "multipart/form-data" 
                },
                withCredentials: true,
            });
    
            alert("Profile photo updated successfully!");
            
            // Update the profile image in state immediately
            setUserData(prev => ({ ...prev, profileImage: response.data.profileImage }));
        } catch (err) {
            setError("Failed to update profile photo.");
        } finally {
            setLoadingProfileImage(false); // Hide spinner
        }
    };
    

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
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

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        navigate("/");
    };

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <div className="settings-page">
                <h1>Settings</h1>

                {error && <div className="error-message">{error}</div>}

                <div className="settings-section">
                    <h2 onClick={() => toggleSection("profilePhoto")}>Change Profile Photo</h2>
                    {activeSection === "profilePhoto" && (
                        <form onSubmit={handleProfileImageUpdate}>
                            <input type="file" accept="image/*" onChange={(e) => setNewProfileImage(e.target.files[0])} />
                            {userData.profileImage && <img src={userData.profileImage} alt="Profile" className="profile-image-preview" />}
                            
                            {loadingProfileImage ? (
                                <div className="spinner"></div> // Add CSS spinner
                            ) : (
                                <button type="submit">Update Profile Photo</button>
                            )}
                        </form>
                    )}
                </div>


                <div className="settings-section">
                    <h2 onClick={() => toggleSection("bio")}>Change Bio</h2>
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