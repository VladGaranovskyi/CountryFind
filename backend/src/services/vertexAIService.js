import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { GoogleAuth } from 'google-auth-library';

class VertexAIService {
  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.location = process.env.VERTEX_AI_LOCATION || 'us-central1';
    this.client = null;
    this.auth = null;
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize Google Auth
      this.auth = new GoogleAuth({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      });

      // Initialize Vertex AI client
      this.client = new PredictionServiceClient({
        auth: this.auth,
        apiEndpoint: `${this.location}-aiplatform.googleapis.com`
      });

      console.log('✅ Vertex AI service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Vertex AI service:', error.message);
      throw error;
    }
  }

  async generateEmbedding(text) {
    try {
      if (!this.client) {
        await this.initialize();
      }

      const endpoint = `projects/${this.projectId}/locations/${this.location}/publishers/google/models/textembedding-gecko@003`;

      const instanceValue = {
        content: text,
        task_type: 'SEMANTIC_SIMILARITY'
      };

      const instances = [instanceValue];
      const parameters = {
        autoTruncate: true
      };

      const request = {
        endpoint,
        instances,
        parameters
      };

      const [response] = await this.client.predict(request);
      
      if (response.predictions && response.predictions.length > 0) {
        const embedding = response.predictions[0].embeddings.values;
        return embedding;
      } else {
        throw new Error('No embedding returned from Vertex AI');
      }
    } catch (error) {
      console.error('❌ Error generating embedding:', error.message);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  async generateCountryEmbedding(country) {
    try {
      // Create a comprehensive text representation of the country
      const countryText = this.createCountryDescription(country);
      return await this.generateEmbedding(countryText);
    } catch (error) {
      console.error(`❌ Error generating embedding for ${country.name}:`, error.message);
      throw error;
    }
  }

  createCountryDescription(country) {
    const { name, region, capital, indicators } = country;
    
    // Create a rich text description for embedding
    const description = `
      Country: ${name}
      Region: ${region}
      Capital: ${capital}
      GDP per capita: $${indicators.gdp}
      Life expectancy: ${indicators.lifeExpectancy} years
      Education index: ${indicators.education}%
      CO2 emissions per capita: ${indicators.co2Emissions} tons
      Population: ${indicators.population} million
      ${indicators.unemploymentRate ? `Unemployment rate: ${indicators.unemploymentRate}%` : ''}
      ${indicators.corruptionIndex ? `Corruption perception index: ${indicators.corruptionIndex}` : ''}
      ${indicators.happinessScore ? `Happiness score: ${indicators.happinessScore}` : ''}
      Economic development level: ${this.getEconomicLevel(indicators.gdp)}
      Environmental impact: ${this.getEnvironmentalLevel(indicators.co2Emissions)}
      Social development: ${this.getSocialLevel(indicators.lifeExpectancy, indicators.education)}
    `.trim();

    return description;
  }

  getEconomicLevel(gdp) {
    if (gdp > 50000) return 'high income developed economy';
    if (gdp > 25000) return 'upper middle income economy';
    if (gdp > 10000) return 'middle income economy';
    if (gdp > 3000) return 'lower middle income economy';
    return 'low income developing economy';
  }

  getEnvironmentalLevel(co2) {
    if (co2 > 15) return 'high carbon emissions';
    if (co2 > 8) return 'moderate carbon emissions';
    if (co2 > 4) return 'low carbon emissions';
    return 'very low carbon emissions';
  }

  getSocialLevel(lifeExpectancy, education) {
    const avgScore = (lifeExpectancy / 85 + education / 100) / 2;
    if (avgScore > 0.8) return 'high human development';
    if (avgScore > 0.6) return 'medium human development';
    return 'low human development';
  }
}

export default new VertexAIService();