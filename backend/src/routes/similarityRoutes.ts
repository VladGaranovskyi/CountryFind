import express from 'express';
import { SimilarityController } from '../controllers/similarityController';

const router = express.Router();
const similarityController = new SimilarityController();

router.post('/find', similarityController.findSimilarCountries);

export default router;