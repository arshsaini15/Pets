import { User } from '../models/user.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const connectUser = asyncHandler(async (req, res) => {
    console.log('Request Body:', req.body)
    console.log('Authenticated User:', req.user)

    const userId = req.body.userId
    const currentUser = req.user

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" })
    }

    try {

        const userToConnect = await User.findById(userId)
        const currentUserData = await User.findById(currentUser.id)

        if (!userToConnect || !currentUserData) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (currentUserData.connections.includes(userId)) {
            return res.status(400).json({ message: 'Already connected' })
        }

        currentUserData.connections.push(userId)
        userToConnect.connections.push(currentUser.id)

        currentUserData.hiddenUsers.push(userId)
        userToConnect.hiddenUsers.push(currentUser.id)

        await currentUserData.save()
        await userToConnect.save()

        return res.status(200).json({ message: 'Connection successful' });
    } catch (error) {
        console.error('Error connecting users:', error)
        return res.status(500).json({ message: 'Error connecting users', error: error.message })
    }
})