import { Request, Response } from 'express';
import { VectorSearchService } from '../services/vectorSearchService';

export class SimilarityController {
  private vectorSearchService: VectorSearchService;

  constructor() {
    this.vectorSearchService = new VectorSearchService();
  }

  async findSimilarCountries(req: Request, res: Response) {
    try {
      const { countryId, limit = 5, threshold = 0.7 } = req.body;
      
      const similarCountries = await this.vectorSearchService.findSimilarCountries(
        countryId,
        limit,
        threshold
      );
      
      res.json(similarCountries);
    } catch (error) {
      console.error('Error finding similar countries:', error);
      res.status(500).json({ error: 'Failed to find similar countries' });
    }
  }
}