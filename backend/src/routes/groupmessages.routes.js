import express from 'express'
import { getMessages, addMessages, groupInfo } from '../controllers/groupmessages.controller.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = express.Router();

router.get('/:groupId', authenticateUser, groupInfo)
router.get('/messages/:groupId', authenticateUser, getMessages)
router.post('/messages', authenticateUser, addMessages)

export default router;