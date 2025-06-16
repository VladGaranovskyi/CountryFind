import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Country Similarity Finder API',
      version: '1.0.0',
      description: 'API for finding similar countries using AI-powered embeddings and vector search',
      contact: {
        name: 'API Support',
        email: 'support@smart-country.app'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-api-domain.com' 
          : `http://localhost:${process.env.PORT || 8000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key for admin endpoints'
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for admin endpoints'
        }
      },
      schemas: {
        Country: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            iso_code: { type: 'string' },
            flag: { type: 'string' },
            region: { type: 'string' },
            capital: { type: 'string' },
            indicators: {
              type: 'object',
              properties: {
                gdp: { type: 'number' },
                lifeExpectancy: { type: 'number' },
                education: { type: 'number' },
                co2Emissions: { type: 'number' },
                population: { type: 'number' },
                unemploymentRate: { type: 'number', nullable: true },
                corruptionIndex: { type: 'number', nullable: true },
                happinessScore: { type: 'number', nullable: true }
              }
            },
            metadata: {
              type: 'object',
              properties: {
                lastUpdated: { type: 'string', format: 'date-time' },
                dataSource: { type: 'string' },
                confidence: { type: 'number' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        SimilarityResult: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/Country' },
            {
              type: 'object',
              properties: {
                similarityScore: { type: 'number', minimum: 0, maximum: 1 },
                similarityReasons: {
                  type: 'array',
                  items: { type: 'string' }
                }
              }
            }
          ]
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Countries',
        description: 'Country data management'
      },
      {
        name: 'Similarity',
        description: 'Country similarity search using AI'
      },
      {
        name: 'Admin',
        description: 'Administrative functions (requires authentication)'
      },
      {
        name: 'Authentication',
        description: 'API key management'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Smart Country Similarity API'
  }));
  
  // JSON endpoint for the spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};