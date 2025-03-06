import { Pet } from '../models/pet.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getPetProfile = asyncHandler(async (req, res) => {
    const { petId } = req.params
  
    const pet = await Pet.findById(petId)
    .populate('owner', 'username')

    if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
    }
  
    res.status(200).json(pet)
})