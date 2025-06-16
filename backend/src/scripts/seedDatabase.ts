import { connectDatabase, disconnectDatabase } from '../config/database';
import { Country } from '../models/Country';

const sampleCountries = [
  {
    name: 'United States',
    code: 'US',
    region: 'Americas',
    subregion: 'Northern America',
    population: 331900000,
    gdp: 21430000000000,
    gdpPerCapita: 64543,
    area: 9833517,
    languages: ['English'],
    currencies: ['USD'],
    government: 'Federal Republic',
    climate: 'Varied - temperate to tropical',
    geography: 'Large landmass with diverse terrain',
    culture: 'Diverse multicultural society',
    economy: 'Advanced mixed economy'
  },
  {
    name: 'Germany',
    code: 'DE',
    region: 'Europe',
    subregion: 'Western Europe',
    population: 83200000,
    gdp: 3860000000000,
    gdpPerCapita: 46401,
    area: 357022,
    languages: ['German'],
    currencies: ['EUR'],
    government: 'Federal Republic',
    climate: 'Temperate oceanic',
    geography: 'Central European plains and mountains',
    culture: 'Rich cultural heritage',
    economy: 'Advanced industrial economy'
  }
];

async function seedDatabase() {
  try {
    await connectDatabase();
    
    // Clear existing data
    await Country.deleteMany({});
    
    // Insert sample data
    await Country.insertMany(sampleCountries);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  seedDatabase();
}