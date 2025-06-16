import express from 'express';
import { WorldBankController } from '../controllers/worldBankController';

const router = express.Router();
const worldBankController = new WorldBankController();

router.get('/indicators/:countryCode', worldBankController.getIndicators);

export default router;