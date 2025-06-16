import { Request, Response } from 'express';
import { Country } from '../models/Country';

export class AdminController {
  async getStats(req: Request, res: Response) {
    try {
      const totalCountries = await Country.countDocuments();
      const countriesWithEmbeddings = await Country.countDocuments({
        embedding: { $exists: true, $ne: null }
      });

      res.json({
        totalCountries,
        countriesWithEmbeddings,
        embeddingCoverage: totalCountries > 0 ? (countriesWithEmbeddings / totalCountries) * 100 : 0
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}