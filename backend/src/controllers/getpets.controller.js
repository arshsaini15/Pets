import { Pet } from '../models/pet.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getPets = asyncHandler(async (req, res) => {
    const userId = req.userId
    const pets = await Pet.find({ owner: userId })

    if (!pets) {
        return res.status(404).json({ message: 'No pets found for this user.'})
    }

    res.status(200).json(pets)
})