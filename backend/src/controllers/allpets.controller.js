import { Pet } from '../models/pet.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const allPets = asyncHandler(async (req, res) => {
        const userId = req.headers.userid;
        const pets = await Pet.find({ owner: { $ne: userId } })
        .populate('owner', 'username')
        .sort({ name: 1 });

        const formattedPets = pets.map((pet) => ({
        ...pet.toObject(),
        ownerId: pet.owner._id,
        }))

        console.log(formattedPets);

        res.status(200).json(formattedPets)
})