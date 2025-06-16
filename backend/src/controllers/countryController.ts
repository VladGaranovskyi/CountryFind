import { Request, Response } from 'express';
import { Country } from '../models/Country';

export class CountryController {
  async getAllCountries(req: Request, res: Response) {
    try {
      const countries = await Country.find().select('-embedding');
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch countries' });
    }
  }

  async getCountryById(req: Request, res: Response) {
    try {
      const country = await Country.findById(req.params.id).select('-embedding');
      if (!country) {
        return res.status(404).json({ error: 'Country not found' });
      }
      res.json(country);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch country' });
    }
  }

  async createCountry(req: Request, res: Response) {
    try {
      const country = new Country(req.body);
      await country.save();
      res.status(201).json(country);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create country' });
    }
  }

  async updateCountry(req: Request, res: Response) {
    try {
      const country = await Country.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-embedding');
      
      if (!country) {
        return res.status(404).json({ error: 'Country not found' });
      }
      
      res.json(country);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update country' });
    }
  }

  async deleteCountry(req: Request, res: Response) {
    try {
      const country = await Country.findByIdAndDelete(req.params.id);
      if (!country) {
        return res.status(404).json({ error: 'Country not found' });
      }
      res.json({ message: 'Country deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete country' });
    }
  }
}