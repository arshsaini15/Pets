import { Group } from '../models/group.models.js';
import { User } from '../models/user.models.js';

export const createGroup = async (req, res) => {
  try {
    const { name, participants = [], groupImage } = req.body;

    console.log(req.body);
    const creator = req.user;
    console.log(creator);

    if (!creator || !creator.id) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    if (!name || !Array.isArray(participants)) {
      return res.status(400).json({ message: "Group name and participants are required." });
    }

    console.log('creating group!');
    // Ensure the creator is included
    const creatorIdStr = creator.id.toString();
    const updatedParticipants = participants.includes(creatorIdStr)
      ? participants
      : [...participants, creatorIdStr];

      

    const newGroup = new Group({
      name,
      groupImage,
      participants: updatedParticipants,
      createdBy: creator.id,
    });

    await newGroup.save();

    const populatedGroup = await Group.findById(newGroup._id)
      .populate("participants", "username profileImage");

    return res.status(201).json(populatedGroup);
  } catch (err) {
    console.error("Error creating group:", err.message);
    return res.status(500).json({ message: "Server error while creating group." });
  }
};