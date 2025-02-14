import { Pet } from '../models/pet.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const allPets = asyncHandler(async (req, res) => {
    try {
        const pets = await Pet.find({ owner: { $ne: req.userId } })
            .populate('owner', 'username')
            .sort({ name: 1 })
        
        if (!pets || pets.length === 0) {
            return res.status(404).json({ message: "No pets found." })
        }
        
        res.status(200).json(pets)
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later." })
    }
})