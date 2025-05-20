import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'

export const showallUsers = asyncHandler(async (req, res) => {
//   const allUsers = await User.find({$ne: req.userId}, '-password -__v')
  const allUsers = await User.find({ _id: { $ne: req.userId } }, '-password -__v')


  res.status(200).json({
    success: true,
    count: allUsers.length,
    users: allUsers,
  })
})