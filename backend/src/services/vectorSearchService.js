import { MongoClient } from 'mongodb';
import Country from '../models/Country.js';

class VectorSearchService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
  }

  async initialize() {
    try {
      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db();
      this.collection = this.db.collection('countries');
      console.log('✅ Vector search service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize vector search service:', error.message);
      throw error;
    }
  }

  async searchSimilarCountries(queryEmbedding, limit = 10, excludeCountry = null) {
    try {
      if (!this.collection) {
        await this.initialize();
      }

      // MongoDB Atlas Vector Search aggregation pipeline
      const pipeline = [
        {
          $vectorSearch: {
            index: 'country_vector_index', // This needs to be created in MongoDB Atlas
            path: 'embedding',
            queryVector: queryEmbedding,
            numCandidates: Math.max(limit * 5, 100),
            limit: limit + (excludeCountry ? 1 : 0)
          }
        },
        {
          $addFields: {
            similarityScore: { $meta: 'vectorSearchScore' }
          }
        },
        {
          $match: excludeCountry ? { name: { $ne: excludeCountry } } : {}
        },
        {
          $limit: limit
        },
        {
          $project: {
            name: 1,
            iso_code: 1,
            flag: 1,
            region: 1,
            capital: 1,
            indicators: 1,
            similarityScore: 1,
            metadata: 1
          }
        }
      ];

      const results = await this.collection.aggregate(pipeline).toArray();
      
      return results.map(result => ({
        ...result,
        similarityScore: Math.min(result.similarityScore || 0, 1) // Normalize score to 0-1
      }));

    } catch (error) {
      console.error('❌ Vector search error:', error.message);
      
      // Fallback to traditional similarity calculation
      console.log('🔄 Falling back to traditional similarity calculation');
      return await this.fallbackSimilaritySearch(excludeCountry, limit);
    }
  }

  async fallbackSimilaritySearch(excludeCountry, limit) {
    try {
      const countries = await Country.find(
        excludeCountry ? { name: { $ne: excludeCountry } } : {}
      );

      if (!excludeCountry || countries.length === 0) {
        return countries.slice(0, limit).map(country => ({
          ...country.toObject(),
          similarityScore: Math.random() * 0.3 + 0.7 // Random score for demo
        }));
      }

      const referenceCountry = await Country.findOne({ name: excludeCountry });
      if (!referenceCountry) {
        return countries.slice(0, limit).map(country => ({
          ...country.toObject(),
          similarityScore: Math.random() * 0.3 + 0.7
        }));
      }

      // Calculate similarity using the model method
      const similarities = countries.map(country => ({
        ...country.toObject(),
        similarityScore: referenceCountry.calculateSimilarity(country)
      }));

      // Sort by similarity score and return top results
      return similarities
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, limit);

    } catch (error) {
      console.error('❌ Fallback similarity search error:', error.message);
      throw error;
    }
  }

  async createVectorSearchIndex() {
    try {
      if (!this.collection) {
        await this.initialize();
      }

      // Note: This is the index definition that needs to be created in MongoDB Atlas UI
      const indexDefinition = {
        name: 'country_vector_index',
        type: 'vectorSearch',
        definition: {
          fields: [
            {
              type: 'vector',
              path: 'embedding',
              numDimensions: 768, // textembedding-gecko@003 produces 768-dimensional vectors
              similarity: 'cosine'
            }
          ]
        }
      };

      console.log('📋 Vector search index definition:');
      console.log(JSON.stringify(indexDefinition, null, 2));
      console.log('⚠️  Please create this index manually in MongoDB Atlas UI');

      return indexDefinition;
    } catch (error) {
      console.error('❌ Error creating vector search index:', error.message);
      throw error;
    }
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log('📴 Vector search service connection closed');
    }
  }
}

export default new VectorSearchService();