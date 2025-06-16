import fs from 'fs';
import csv from 'csv-parser';
import Country from '../models/Country.js';
import vertexAIService from '../services/vertexAIService.js';
import vectorSearchService from '../services/vectorSearchService.js';

export const uploadCountryData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: 'Please upload a JSON or CSV file'
      });
    }

    const { updateExisting = false } = req.body;
    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    let countries = [];

    if (fileExtension === 'json') {
      // Parse JSON file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      countries = JSON.parse(fileContent);
    } else if (fileExtension === 'csv') {
      // Parse CSV file
      countries = await parseCSVFile(filePath);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid file format',
        message: 'Only JSON and CSV files are supported'
      });
    }

    // Validate and process countries
    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: []
    };

    for (const countryData of countries) {
      try {
        // Validate required fields
        if (!countryData.name || !countryData.iso_code) {
          results.errors.push(`Missing required fields for country: ${JSON.stringify(countryData)}`);
          continue;
        }

        // Generate embedding
        const embedding = await vertexAIService.generateCountryEmbedding(countryData);

        // Prepare country document
        const countryDoc = {
          ...countryData,
          embedding,
          metadata: {
            lastUpdated: new Date(),
            dataSource: 'Admin Upload',
            confidence: 1.0
          }
        };

        // Check if country exists
        const existingCountry = await Country.findOne({
          $or: [
            { name: countryData.name },
            { iso_code: countryData.iso_code }
          ]
        });

        if (existingCountry) {
          if (updateExisting) {
            await Country.findByIdAndUpdate(existingCountry._id, countryDoc);
            results.updated++;
          } else {
            results.errors.push(`Country ${countryData.name} already exists (use updateExisting=true to update)`);
          }
        } else {
          await Country.create(countryDoc);
          results.created++;
        }

        results.processed++;

      } catch (error) {
        results.errors.push(`Error processing ${countryData.name}: ${error.message}`);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      data: results,
      message: `Processed ${results.processed} countries. Created: ${results.created}, Updated: ${results.updated}, Errors: ${results.errors.length}`
    });

  } catch (error) {
    console.error('❌ Upload country data error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload country data',
      message: error.message
    });
  }
};

export const refreshAllEmbeddings = async (req, res) => {
  try {
    const countries = await Country.find({});
    const results = {
      total: countries.length,
      updated: 0,
      errors: []
    };

    for (const country of countries) {
      try {
        const embedding = await vertexAIService.generateCountryEmbedding(country);
        
        await Country.findByIdAndUpdate(country._id, {
          embedding,
          'metadata.lastUpdated': new Date()
        });

        results.updated++;
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        results.errors.push(`Error updating ${country.name}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      data: results,
      message: `Refreshed embeddings for ${results.updated}/${results.total} countries`
    });

  } catch (error) {
    console.error('❌ Refresh embeddings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh embeddings',
      message: error.message
    });
  }
};

export const createVectorIndex = async (req, res) => {
  try {
    const indexDefinition = await vectorSearchService.createVectorSearchIndex();
    
    res.json({
      success: true,
      data: indexDefinition,
      message: 'Vector search index definition generated. Please create this index in MongoDB Atlas UI.',
      instructions: [
        '1. Go to MongoDB Atlas Dashboard',
        '2. Navigate to your cluster',
        '3. Click on "Search" tab',
        '4. Click "Create Search Index"',
        '5. Choose "JSON Editor"',
        '6. Paste the provided index definition',
        '7. Set the database and collection names',
        '8. Click "Create Search Index"'
      ]
    });

  } catch (error) {
    console.error('❌ Create vector index error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create vector index definition',
      message: error.message
    });
  }
};

export const getSystemStats = async (req, res) => {
  try {
    const countryCount = await Country.countDocuments();
    const recentUpdates = await Country.find({}, { name: 1, 'metadata.lastUpdated': 1 })
      .sort({ 'metadata.lastUpdated': -1 })
      .limit(10);

    const embeddingStats = await Country.aggregate([
      {
        $group: {
          _id: null,
          totalWithEmbeddings: {
            $sum: {
              $cond: [{ $gt: [{ $size: '$embedding' }, 0] }, 1, 0]
            }
          },
          avgEmbeddingSize: { $avg: { $size: '$embedding' } }
        }
      }
    ]);

    const systemInfo = {
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      environment: process.env.NODE_ENV
    };

    res.json({
      success: true,
      data: {
        countries: {
          total: countryCount,
          withEmbeddings: embeddingStats[0]?.totalWithEmbeddings || 0,
          avgEmbeddingSize: Math.round(embeddingStats[0]?.avgEmbeddingSize || 0)
        },
        recentUpdates,
        system: systemInfo,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Get system stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve system statistics',
      message: error.message
    });
  }
};

// Helper function to parse CSV files
function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Convert string numbers to actual numbers
        const processedData = {};
        for (const [key, value] of Object.entries(data)) {
          if (!isNaN(value) && value !== '') {
            processedData[key] = parseFloat(value);
          } else {
            processedData[key] = value;
          }
        }
        results.push(processedData);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}