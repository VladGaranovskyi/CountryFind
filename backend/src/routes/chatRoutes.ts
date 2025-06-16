import express from 'express';
import { ChatController } from '../controllers/chatController';

const router = express.Router();
const chatController = new ChatController();

router.post('/message', chatController.sendMessage);

export default router;