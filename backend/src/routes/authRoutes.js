import express from 'express';
import { generateApiKey, validateApiKey } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/generate-key:
 *   post:
 *     summary: Generate API key
 *     description: Generate a new API key for admin access (development only)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               masterKey:
 *                 type: string
 *                 description: Master key for generating API keys
 *             required:
 *               - masterKey
 *     responses:
 *       200:
 *         description: API key generated successfully
 *       401:
 *         description: Invalid master key
 */
router.post('/generate-key', generateApiKey);

/**
 * @swagger
 * /api/auth/validate-key:
 *   post:
 *     summary: Validate API key
 *     description: Validate an API key
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *                 description: API key to validate
 *             required:
 *               - apiKey
 *     responses:
 *       200:
 *         description: API key is valid
 *       401:
 *         description: Invalid API key
 */
router.post('/validate-key', validateApiKey);

export default router;