import Country from '../models/Country.js';

export const getAllCountries = async (req, res) => {
  try {
    const { 
      region, 
      limit = 50, 
      sort = 'name', 
      order = 'asc',
      page = 1 
    } = req.query;

    // Build query
    const query = {};
    if (region) {
      query.region = { $regex: new RegExp(region, 'i') };
    }

    // Build sort object
    const sortObj = {};
    if (sort === 'gdp' || sort === 'lifeExpectancy' || sort === 'education' || sort === 'co2Emissions') {
      sortObj[`indicators.${sort}`] = order === 'desc' ? -1 : 1;
    } else {
      sortObj[sort] = order === 'desc' ? -1 : 1;
    }

    // Calculate pagination
    const limitNum = Math.min(parseInt(limit), 200);
    const skip = (parseInt(page) - 1) * limitNum;

    // Execute query
    const countries = await Country.find(query, { embedding: 0 }) // Exclude embedding from response
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const totalCount = await Country.countDocuments(query);

    res.json({
      success: true,
      data: countries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasNext: skip + limitNum < totalCount,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('❌ Get all countries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve countries',
      message: error.message
    });
  }
};

export const getCountryByCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    const country = await Country.findOne({
      $or: [
        { iso_code: code.toUpperCase() },
        { name: { $regex: new RegExp(code, 'i') } }
      ]
    }, { embedding: 0 }); // Exclude embedding from response

    if (!country) {
      return res.status(404).json({
        success: false,
        error: 'Country not found',
        message: `Country with code "${code}" not found`
      });
    }

    res.json({
      success: true,
      data: country
    });

  } catch (error) {
    console.error('❌ Get country by code error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve country',
      message: error.message
    });
  }
};

export const getCountriesForDropdown = async (req, res) => {
  try {
    const countries = await Country.getCountriesForDropdown();
    
    res.json({
      success: true,
      data: countries.map(country => ({
        name: country.name,
        code: country.iso_code,
        flag: country.flag,
        region: country.region
      }))
    });

  } catch (error) {
    console.error('❌ Get countries for dropdown error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve countries for dropdown',
      message: error.message
    });
  }
};

export const getCountryStats = async (req, res) => {
  try {
    const stats = await Country.aggregate([
      {
        $group: {
          _id: null,
          totalCountries: { $sum: 1 },
          avgGDP: { $avg: '$indicators.gdp' },
          avgLifeExpectancy: { $avg: '$indicators.lifeExpectancy' },
          avgEducation: { $avg: '$indicators.education' },
          avgCO2: { $avg: '$indicators.co2Emissions' },
          totalPopulation: { $sum: '$indicators.population' },
          regions: { $addToSet: '$region' }
        }
      }
    ]);

    const regionStats = await Country.aggregate([
      {
        $group: {
          _id: '$region',
          count: { $sum: 1 },
          avgGDP: { $avg: '$indicators.gdp' },
          avgLifeExpectancy: { $avg: '$indicators.lifeExpectancy' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const topCountries = {
      byGDP: await Country.find({}, { name: 1, flag: 1, 'indicators.gdp': 1 })
        .sort({ 'indicators.gdp': -1 }).limit(5),
      byLifeExpectancy: await Country.find({}, { name: 1, flag: 1, 'indicators.lifeExpectancy': 1 })
        .sort({ 'indicators.lifeExpectancy': -1 }).limit(5),
      byEducation: await Country.find({}, { name: 1, flag: 1, 'indicators.education': 1 })
        .sort({ 'indicators.education': -1 }).limit(5)
    };

    res.json({
      success: true,
      data: {
        global: stats[0] || {},
        byRegion: regionStats,
        topCountries,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Get country stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve country statistics',
      message: error.message
    });
  }
};