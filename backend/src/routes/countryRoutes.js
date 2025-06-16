import express from 'express';
import { 
  getAllCountries, 
  getCountryByCode, 
  getCountriesForDropdown,
  getCountryStats 
} from '../controllers/countryController.js';

const router = express.Router();

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Get all countries
 *     description: Retrieve all countries with their indicators and metadata
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter by region
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *         description: Limit number of results
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, gdp, lifeExpectancy, education, co2Emissions]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successfully retrieved countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Country'
 *                 totalCount:
 *                   type: integer
 */
router.get('/', getAllCountries);

/**
 * @swagger
 * /api/countries/dropdown:
 *   get:
 *     summary: Get countries for dropdown
 *     description: Get simplified country data for dropdown menus
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Successfully retrieved dropdown data
 */
router.get('/dropdown', getCountriesForDropdown);

/**
 * @swagger
 * /api/countries/stats:
 *   get:
 *     summary: Get global statistics
 *     description: Get aggregated statistics across all countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Successfully retrieved statistics
 */
router.get('/stats', getCountryStats);

/**
 * @swagger
 * /api/countries/{code}:
 *   get:
 *     summary: Get country by ISO code
 *     description: Retrieve detailed information for a specific country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: ISO country code (2 or 3 letters)
 *     responses:
 *       200:
 *         description: Successfully retrieved country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Country'
 *       404:
 *         description: Country not found
 */
router.get('/:code', getCountryByCode);

export default router;