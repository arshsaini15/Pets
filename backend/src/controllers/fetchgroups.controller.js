import {Group} from '../models/group.models.js'

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.find({ participants: userId })
      .populate("participants", "username profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};