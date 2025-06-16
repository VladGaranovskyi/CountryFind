import express from 'express';
import { searchSimilarCountries } from '../controllers/similarityController.js';
import { validateSimilaritySearch } from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/similarity/search:
 *   post:
 *     summary: Search for similar countries
 *     description: Find countries similar to a given country or text description using AI embeddings
 *     tags: [Similarity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 description: Name of reference country
 *                 example: "Germany"
 *               description:
 *                 type: string
 *                 description: Text description of desired country characteristics
 *                 example: "developed country with high education and low CO2 emissions"
 *               limit:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 50
 *                 default: 10
 *                 description: Maximum number of results to return
 *             oneOf:
 *               - required: [country]
 *               - required: [description]
 *     responses:
 *       200:
 *         description: Successfully found similar countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: string
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SimilarityResult'
 *                     totalResults:
 *                       type: integer
 *                     searchTime:
 *                       type: string
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.post('/search', validateSimilaritySearch, searchSimilarCountries);

export default router;