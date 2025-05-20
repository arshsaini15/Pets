import { Group } from "../models/group.models.js";

export const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find group by ID and populate participant info (username, profileImage)
    const group = await Group.findById(groupId).populate("participants", "username profileImage");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Send group details as JSON
    res.json(group);
  } catch (err) {
    console.error("Error fetching group details:", err);
    res.status(500).json({ message: "Server error fetching group details" });
  }
};