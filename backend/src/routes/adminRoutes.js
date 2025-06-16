import express from 'express';
import multer from 'multer';
import { 
  uploadCountryData, 
  refreshAllEmbeddings, 
  getSystemStats,
  createVectorIndex 
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json' || 
        file.mimetype === 'text/csv' || 
        file.originalname.endsWith('.csv') ||
        file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON and CSV files are allowed'), false);
    }
  }
});

// Apply admin authentication to all routes
router.use(authenticateAdmin);

/**
 * @swagger
 * /api/admin/upload:
 *   post:
 *     summary: Upload country data
 *     description: Upload JSON or CSV file with country indicator data
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: JSON or CSV file with country data
 *               updateExisting:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to update existing countries
 *     responses:
 *       200:
 *         description: Successfully uploaded and processed data
 *       400:
 *         description: Invalid file format or data
 *       401:
 *         description: Unauthorized
 */
router.post('/upload', upload.single('file'), uploadCountryData);

/**
 * @swagger
 * /api/admin/refresh-embeddings:
 *   post:
 *     summary: Refresh all embeddings
 *     description: Regenerate embeddings for all countries using Vertex AI
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successfully refreshed embeddings
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh-embeddings', refreshAllEmbeddings);

/**
 * @swagger
 * /api/admin/create-vector-index:
 *   post:
 *     summary: Create vector search index
 *     description: Generate the vector search index definition for MongoDB Atlas
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Vector index definition generated
 */
router.post('/create-vector-index', createVectorIndex);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics
 *     description: Retrieve system performance and data statistics
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved system stats
 */
router.get('/stats', getSystemStats);

export default router;