import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddPost.css";

const AddPostPage = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [description, setDescription] = useState("");
    const [adoptionStatus, setAdoptionStatus] = useState("Available");
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(""); // Store "lat:long"
    const [locationAddress, setLocationAddress] = useState(""); // Store city name
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Handle Manual Location Entry (City Name -> lat:long)
    const handleManualLocationChange = async (e) => {
        const address = e.target.value;
        setLocationAddress(address); // Store manually entered address

        try {
            if (address.trim().length === 0) {
                setLocation(""); // Reset if input is empty
                return;
            }

            // Convert address to lat/lon (Forward Geocoding)
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
            if (res.data.length > 0) {
                const { lat, lon } = res.data[0];
                const formattedLocation = `${parseFloat(lat).toFixed(4)}:${parseFloat(lon).toFixed(4)}`;
                setLocation(formattedLocation); // Store as "lat:long"
            } else {
                console.warn("Location not found");
            }
        } catch (error) {
            console.error("Error fetching geolocation:", error);
        }
    };

    // Handle "Use Current Location"
    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const formattedLocation = `${latitude.toFixed(4)}:${longitude.toFixed(4)}`;
                    setLocation(formattedLocation); // Store lat:long

                    try {
                        // Reverse Geocoding to get city name
                        const res = await axios.get(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const city = res.data.address.city || res.data.address.town || res.data.address.village || "Unknown Location";
                        setLocationAddress(city); // Store readable name
                    } catch (err) {
                        console.error("Error fetching location address:", err);
                        setLocationAddress("Unknown Location");
                    }
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    setError("Failed to get location. Please enter it manually.");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("species", species);
        formData.append("breed", breed);
        formData.append("age", age);
        formData.append("description", description);
        formData.append("adoptionStatus", adoptionStatus);
        formData.append("location", location); // Send "lat:long"
        formData.append("locationAddress", locationAddress); // Send "New Delhi"
        if (image) {
            formData.append("image", image);
        }

        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://localhost:8000/api/v1/pets/createpost",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert("Pet added successfully!");
            setName("");
            setSpecies("");
            setBreed("");
            setAge("");
            setDescription("");
            setImage(null);
            setLocation("");
            setLocationAddress("");
            navigate("/profile");
        } catch (err) {
            setError("Failed to add pet");
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="add-post-page">
                <h2>Add a Pet</h2>
                <form onSubmit={handleSubmit} className="post-form">
                    <div className="form-group">
                        <label htmlFor="name">Pet Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter pet name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="species">Species</label>
                        <input
                            id="species"
                            type="text"
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                            placeholder="Enter species"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="breed">Breed</label>
                        <input
                            id="breed"
                            type="text"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            placeholder="Enter breed"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input
                            id="age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="Enter age"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Price</label>
                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="Enter price"
                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write about the pet..."
                        />
                    </div>

                    {/* Updated Location Input */}
                    <div className="form-group">
                        <label htmlFor="location"><b>Location</b></label>
                        <input
                            id="location"
                            type="text"
                            value={locationAddress}
                            onChange={handleManualLocationChange}
                            placeholder="Enter location (e.g., New Delhi)"
                        />
                        <button type="button" onClick={handleUseCurrentLocation}>
                            Use Current Location
                        </button>
                        {location && <p>Geo Coordinates: <b>{location}</b></p>}
                        {locationAddress && <p>Location Name: <b>{locationAddress}</b></p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="image"><b>Upload Image</b></label><br />
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                Adding Pet... <span className="spinner"></span>
                            </>
                        ) : "Add Pet"}
                    </button>

                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </>
    );
};

export default AddPostPage;
