import express from 'express';
import { AdminController } from '../controllers/adminController';

const router = express.Router();
const adminController = new AdminController();

router.get('/stats', adminController.getStats);

export default router;