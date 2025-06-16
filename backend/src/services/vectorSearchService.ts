import { Country } from '../models/Country';
import { SimilarityResult } from '../types';

export class VectorSearchService {
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async findSimilarCountries(
    countryId: string,
    limit: number = 5,
    threshold: number = 0.7
  ): Promise<SimilarityResult[]> {
    try {
      // Get the target country with its embedding
      const targetCountry = await Country.findById(countryId);
      if (!targetCountry || !targetCountry.embedding) {
        throw new Error('Country not found or embedding not available');
      }

      // Get all other countries with embeddings
      const allCountries = await Country.find({
        _id: { $ne: countryId },
        embedding: { $exists: true, $ne: null }
      });

      // Calculate similarities
      const similarities: SimilarityResult[] = [];
      
      for (const country of allCountries) {
        if (country.embedding && country.embedding.length > 0) {
          const similarity = this.cosineSimilarity(
            targetCountry.embedding,
            country.embedding
          );
          
          if (similarity >= threshold) {
            similarities.push({
              country: {
                ...country.toObject(),
                embedding: undefined // Don't return embedding in response
              },
              similarity
            });
          }
        }
      }

      // Sort by similarity (descending) and limit results
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
        
    } catch (error) {
      console.error('Error in findSimilarCountries:', error);
      throw error;
    }
  }
}