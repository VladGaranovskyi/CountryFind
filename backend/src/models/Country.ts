import mongoose, { Schema, Document } from 'mongoose';
import { Country as ICountry } from '../types';

interface CountryDocument extends ICountry, Document {}

const countrySchema = new Schema<CountryDocument>({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  region: { type: String, required: true },
  subregion: { type: String, required: true },
  population: { type: Number, required: true },
  gdp: { type: Number, required: true },
  gdpPerCapita: { type: Number, required: true },
  area: { type: Number, required: true },
  languages: [{ type: String }],
  currencies: [{ type: String }],
  government: { type: String, required: true },
  climate: { type: String, required: true },
  geography: { type: String, required: true },
  culture: { type: String, required: true },
  economy: { type: String, required: true },
  embedding: [{ type: Number }]
}, {
  timestamps: true
});

// Index for vector similarity search
countrySchema.index({ embedding: 1 });
countrySchema.index({ name: 1 });
countrySchema.index({ code: 1 });
countrySchema.index({ region: 1 });

export const Country = mongoose.model<CountryDocument>('Country', countrySchema);