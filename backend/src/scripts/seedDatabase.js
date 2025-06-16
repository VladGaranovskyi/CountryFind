import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Country from '../models/Country.js';
import vertexAIService from '../services/vertexAIService.js';

// Load environment variables
dotenv.config();

const sampleCountries = [
  {
    name: 'United States',
    iso_code: 'US',
    flag: '🇺🇸',
    region: 'North America',
    capital: 'Washington D.C.',
    indicators: {
      gdp: 63543,
      lifeExpectancy: 78.9,
      education: 89,
      co2Emissions: 16.1,
      population: 331,
      unemploymentRate: 3.7,
      corruptionIndex: 67,
      happinessScore: 6.9
    }
  },
  {
    name: 'Germany',
    iso_code: 'DE',
    flag: '🇩🇪',
    region: 'Europe',
    capital: 'Berlin',
    indicators: {
      gdp: 46259,
      lifeExpectancy: 81.3,
      education: 92,
      co2Emissions: 9.4,
      population: 83,
      unemploymentRate: 3.2,
      corruptionIndex: 80,
      happinessScore: 7.0
    }
  },
  {
    name: 'Japan',
    iso_code: 'JP',
    flag: '🇯🇵',
    region: 'Asia',
    capital: 'Tokyo',
    indicators: {
      gdp: 39285,
      lifeExpectancy: 84.6,
      education: 91,
      co2Emissions: 8.8,
      population: 125,
      unemploymentRate: 2.8,
      corruptionIndex: 73,
      happinessScore: 5.9
    }
  },
  {
    name: 'Brazil',
    iso_code: 'BR',
    flag: '🇧🇷',
    region: 'South America',
    capital: 'Brasília',
    indicators: {
      gdp: 8897,
      lifeExpectancy: 75.9,
      education: 76,
      co2Emissions: 2.3,
      population: 215,
      unemploymentRate: 13.2,
      corruptionIndex: 38,
      happinessScore: 6.4
    }
  },
  {
    name: 'South Korea',
    iso_code: 'KR',
    flag: '🇰🇷',
    region: 'Asia',
    capital: 'Seoul',
    indicators: {
      gdp: 31846,
      lifeExpectancy: 83.5,
      education: 95,
      co2Emissions: 11.6,
      population: 52,
      unemploymentRate: 2.7,
      corruptionIndex: 62,
      happinessScore: 5.8
    }
  },
  {
    name: 'Canada',
    iso_code: 'CA',
    flag: '🇨🇦',
    region: 'North America',
    capital: 'Ottawa',
    indicators: {
      gdp: 46195,
      lifeExpectancy: 82.4,
      education: 88,
      co2Emissions: 18.6,
      population: 38,
      unemploymentRate: 5.2,
      corruptionIndex: 77,
      happinessScore: 7.2
    }
  },
  {
    name: 'United Kingdom',
    iso_code: 'GB',
    flag: '🇬🇧',
    region: 'Europe',
    capital: 'London',
    indicators: {
      gdp: 41030,
      lifeExpectancy: 81.3,
      education: 90,
      co2Emissions: 5.6,
      population: 67,
      unemploymentRate: 3.8,
      corruptionIndex: 78,
      happinessScore: 7.0
    }
  },
  {
    name: 'France',
    iso_code: 'FR',
    flag: '🇫🇷',
    region: 'Europe',
    capital: 'Paris',
    indicators: {
      gdp: 39030,
      lifeExpectancy: 82.7,
      education: 89,
      co2Emissions: 4.6,
      population: 68,
      unemploymentRate: 7.9,
      corruptionIndex: 72,
      happinessScore: 6.7
    }
  },
  {
    name: 'Australia',
    iso_code: 'AU',
    flag: '🇦🇺',
    region: 'Oceania',
    capital: 'Canberra',
    indicators: {
      gdp: 51812,
      lifeExpectancy: 83.4,
      education: 87,
      co2Emissions: 15.4,
      population: 26,
      unemploymentRate: 3.5,
      corruptionIndex: 77,
      happinessScore: 7.3
    }
  },
  {
    name: 'China',
    iso_code: 'CN',
    flag: '🇨🇳',
    region: 'Asia',
    capital: 'Beijing',
    indicators: {
      gdp: 10500,
      lifeExpectancy: 77.5,
      education: 85,
      co2Emissions: 7.4,
      population: 1412,
      unemploymentRate: 3.8,
      corruptionIndex: 45,
      happinessScore: 5.1
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Country.deleteMany({});
    console.log('🗑️  Cleared existing country data');
    
    // Process each country
    for (const countryData of sampleCountries) {
      try {
        console.log(`📍 Processing ${countryData.name}...`);
        
        // Generate embedding
        const embedding = await vertexAIService.generateCountryEmbedding(countryData);
        
        // Create country document
        const country = new Country({
          ...countryData,
          embedding,
          metadata: {
            lastUpdated: new Date(),
            dataSource: 'Seed Script',
            confidence: 1.0
          }
        });
        
        await country.save();
        console.log(`✅ Saved ${countryData.name}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Error processing ${countryData.name}:`, error.message);
      }
    }
    
    console.log('🎉 Database seeding completed!');
    console.log(`📊 Total countries seeded: ${await Country.countDocuments()}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding script
seedDatabase();