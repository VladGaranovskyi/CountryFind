import vertexAIService from '../services/vertexAIService.js';
import vectorSearchService from '../services/vectorSearchService.js';
import Country from '../models/Country.js';

export const searchSimilarCountries = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { country, description, limit = 10 } = req.body;
    
    let queryEmbedding;
    let queryText;
    let excludeCountry = null;

    if (country) {
      // Search by reference country
      const referenceCountry = await Country.findOne({ 
        $or: [
          { name: { $regex: new RegExp(country, 'i') } },
          { iso_code: country.toUpperCase() }
        ]
      });

      if (!referenceCountry) {
        return res.status(404).json({
          success: false,
          error: 'Reference country not found',
          message: `Country "${country}" not found in database`
        });
      }

      queryEmbedding = referenceCountry.embedding;
      queryText = referenceCountry.name;
      excludeCountry = referenceCountry.name;

    } else if (description) {
      // Search by text description
      queryText = description;
      queryEmbedding = await vertexAIService.generateEmbedding(description);
    }

    // Perform vector search
    const results = await vectorSearchService.searchSimilarCountries(
      queryEmbedding, 
      parseInt(limit), 
      excludeCountry
    );

    const searchTime = `${Date.now() - startTime}ms`;

    // Add similarity reasons based on indicators
    const enrichedResults = results.map(result => ({
      ...result,
      similarityReasons: generateSimilarityReasons(result, queryText)
    }));

    res.json({
      success: true,
      data: {
        query: queryText,
        results: enrichedResults,
        totalResults: results.length,
        searchTime,
        method: country ? 'country_reference' : 'text_description'
      }
    });

  } catch (error) {
    console.error('❌ Similarity search error:', error);
    res.status(500).json({
      success: false,
      error: 'Similarity search failed',
      message: error.message,
      searchTime: `${Date.now() - startTime}ms`
    });
  }
};

function generateSimilarityReasons(country, query) {
  const reasons = [];
  const indicators = country.indicators;

  // Economic similarity
  if (indicators.gdp > 40000) {
    reasons.push('High-income developed economy');
  } else if (indicators.gdp > 15000) {
    reasons.push('Upper-middle income economy');
  } else if (indicators.gdp > 5000) {
    reasons.push('Middle income economy');
  } else {
    reasons.push('Developing economy');
  }

  // Social development
  if (indicators.lifeExpectancy > 80 && indicators.education > 85) {
    reasons.push('High human development');
  } else if (indicators.lifeExpectancy > 70 && indicators.education > 70) {
    reasons.push('Medium human development');
  }

  // Environmental impact
  if (indicators.co2Emissions < 5) {
    reasons.push('Low carbon footprint');
  } else if (indicators.co2Emissions > 15) {
    reasons.push('High carbon emissions');
  }

  // Regional similarity
  reasons.push(`Located in ${country.region}`);

  // Population size
  if (indicators.population > 100) {
    reasons.push('Large population');
  } else if (indicators.population < 10) {
    reasons.push('Small population');
  }

  return reasons.slice(0, 4); // Return top 4 reasons
}