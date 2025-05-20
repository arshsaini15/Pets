import { GroupMessage } from '../models/groupMessage.models.js'; // Adjust path if needed
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/v1/groupMessages/:groupId
export const getMessages = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const messages = await GroupMessage.find({ groupId }).sort({ createdAt: 1 }); // ascending
  res.status(200).json(messages);
});

// POST /api/v1/groupMessages
export const addMessages = asyncHandler(async (req, res) => {
  const { groupId, text, sender, senderName } = req.body;

  if (!groupId || !text || !sender || !senderName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newMessage = await GroupMessage.create({
    groupId,
    text,
    sender,
    senderName,
    createdAt: new Date(),
  });

  res.status(201).json(newMessage);
});