import { useState } from "react"
import axios from "axios"
import Navbar from "./NavBar.jsx"
import { useNavigate } from "react-router-dom"
import "./AddPost.css"

const AddPostPage = () => {
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [description, setDescription] = useState("");
    const [adoptionStatus, setAdoptionStatus] = useState("Available");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData()
        formData.append("name", name)
        formData.append("species", species)
        formData.append("breed", breed)
        formData.append("age", age)
        formData.append("description", description)
        formData.append("adoptionStatus", adoptionStatus)
        if (image) {
            formData.append("image", image)
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
            )
            alert("Pet added successfully!");
            setName("");
            setSpecies("");
            setBreed("");
            setAge("");
            setDescription("");
            setAdoptionStatus("Available");
            setImage(null);
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
            <Navbar />
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
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Enter age"
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

                    <div className="form-group">
                        <label><b>Adoption Status</b></label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="Available"
                                    checked={adoptionStatus === "Available"}
                                    onChange={(e) => setAdoptionStatus(e.target.value)}
                                />
                                Available
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Not Available"
                                    checked={adoptionStatus === "Not Available"}
                                    onChange={(e) => setAdoptionStatus(e.target.value)}
                                />
                                Not Available
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Adopted"
                                    checked={adoptionStatus === "Adopted"}
                                    onChange={(e) => setAdoptionStatus(e.target.value)}
                                />
                                Adopted
                            </label>
                        </div>
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
                        {loading ? "Adding Pet..." : "Add Pet"}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </>
    )
}

export default AddPostPage