import { Pet } from '../models/pet.models.js'
import { User } from '../models/user.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const connectionPets = asyncHandler(async (req, res) => {
    console.log('pets controller called')
    try {
        const userId = req.userId;
        

        if (!userId) {
            console.log('no userId')
            return res.status(400).json({ message: 'User ID not provided' });
        }

        const user = await User.findById(userId).select('connections');

        if (!user) {
            console.log('error getting user')
            return res.status(404).json({ message: 'User not found' });
        }

        const pets = await Pet.find({ owner: { $in: user.connections } })
            .populate('owner', 'username profileImage')
            .sort({ createdAt: -1 })

        console.log('pets: ',pets);

        res.status(200).json(pets)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Failed to fetch pets" });
    }
})