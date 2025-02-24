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

export const DeletePet = asyncHandler(async (req, res) => {
    const { petId } = req.body
    const userId = req.userId

    if (!petId) {
        return res.status(400).json({ message: "Pet ID is required." })
    }

    const pet = await Pet.findOne({ _id: petId, owner: userId })

    if (!pet) {
        return res.status(404).json({ message: "Pet not found or you do not have permission to delete it." })
    }

    await Pet.findByIdAndDelete(petId)

    res.status(200).json({ message: "Pet deleted successfully!" })
})