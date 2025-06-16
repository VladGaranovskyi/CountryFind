export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Country Similarity API',
      version: '1.0.0',
      description: 'API for finding similar countries using AI embeddings'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};