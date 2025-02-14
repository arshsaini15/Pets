import { User } from '../models/user.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const fetchUsers = asyncHandler(async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId)
        const users = await User.find({
            _id: { $nin: currentUser.hiddenUsers},
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
})
