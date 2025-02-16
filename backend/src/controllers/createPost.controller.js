import { Pet } from '../models/pet.models.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createPost = asyncHandler(async (req, res) => {
    console.log("Received request to create a post");

    // Log request body and file
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const userId = req.userId;
    console.log("User ID:", userId);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        console.error("User not found");
        return res.status(404).json({ message: "User not found" });
    }

    const { name, species, breed, age, description, location, locationAddress, price } = req.body;

    // Validate required fields
    if (!name || !species) {
        console.error("Missing required fields: Name or Species");
        return res.status(400).json({ message: "Name and species are required" });
    }

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
        try {
            const response = await uploadOnCloudinary(req.file.path);
            if (!response || !response.url) {
                throw new Error("Cloudinary upload failed");
            }
            imageUrl = response.url;
            console.log("Image uploaded successfully:", imageUrl);
        } catch (error) {
            console.error("Error uploading image:", error.message);
            return res.status(500).json({ message: "Failed to upload image", error: error.message });
        }
    }

    // Parse location coordinates (lat:long → [long, lat])
    let coordinates = [];
    if (location) {
        const [lat, lon] = location.split(":").map(coord => parseFloat(coord));
        if (!isNaN(lat) && !isNaN(lon)) {
            coordinates = [lon, lat]; // MongoDB stores [longitude, latitude]
        } else {
            console.warn("Invalid location format. Expected 'lat:long'");
        }
    }

    try {
        // Create new pet post
        const newPetPost = await Pet.create({
            name,
            price,
            species,
            breed,
            age,
            description,
            imageUrl,
            owner: userId,
            location: {
                type: "Point",
                coordinates,
                address: locationAddress || "Unknown Location",
            },
        });

        console.log("Pet post created successfully:", newPetPost);
        res.status(201).json(newPetPost);
    } catch (error) {
        console.error("Error creating pet post:", error.message);
        res.status(500).json({ message: "Failed to create pet post", error: error.message });
    }
});
