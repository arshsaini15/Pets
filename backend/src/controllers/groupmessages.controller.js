import { Group } from '../models/group.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/v1/groupMessages/:groupId
export const getMessages = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId)
    .populate("messages.sender", "username profileImage")
    .lean();

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  res.status(200).json(group.messages);
});


// POST /api/v1/groupMessages
export const addMessages = asyncHandler(async (req, res) => {
  const { groupId, text, sender, fileUrl, fileType } = req.body;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  const newMessage = {
    sender,
    text,
    fileUrl,
    fileType,
    timestamp: new Date(),
  };

  group.messages.push(newMessage);
  group.lastMessage = text || fileType || "File";
  group.lastUpdated = new Date();

  await group.save();

  res.status(201).json(newMessage);
});

export const groupInfo = asyncHandler(async(req, res) => {
    const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId).populate('participants', 'username profileImage');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})