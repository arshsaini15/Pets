import { Pet } from '../models/pet.models.js'
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createPost = asyncHandler(async (req, res) => {
    console.log('Request Body:', req.body)
    console.log('Request File:', req.file)

    const userId = req.userId
    console.log('userId', userId)

    const user = await User.findById(userId)
    console.log('user', user)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const { name, species, breed, age, description, adoptionStatus } = req.body

    if (!name || !species) {
        console.log('name or species not found')
        return res.status(400).json({ message: "Name and species are required" })
    }

    let imageUrl = null
    if (req.file) {
        try {
            const response = await uploadOnCloudinary(req.file.path)
            if (response) {
                imageUrl = response.url
            } else {
                return res.status(500).json({ message: "Failed to upload image to Cloudinary" })
            }
        } catch (error) {
            return res.status(500).json({ message: "Error uploading image", error: error.message })
        }
    }

    try {
        const newPetPost = await Pet.create({
            name,
            species,
            breed,
            age,
            description,
            imageUrl,
            adoptionStatus: adoptionStatus || "available",
            owner: userId,
        })

        res.status(201).json(newPetPost)
    } catch (error) {
        console.error("Error creating pet post:", error.message)
        res.status(500).json({ message: "Failed to create pet post", error: error.message })
    }
})