import Joi from 'joi';

const similaritySearchSchema = Joi.object({
  country: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(1000),
  limit: Joi.number().integer().min(1).max(50).default(10)
}).xor('country', 'description'); // Either country OR description is required, but not both

export const validateSimilaritySearch = (req, res, next) => {
  const { error, value } = similaritySearchSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: error.details[0].message,
      details: error.details
    });
  }
  
  req.body = value;
  next();
};

const countrySchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  iso_code: Joi.string().required().length(2).uppercase(),
  flag: Joi.string().required(),
  region: Joi.string().required().min(2).max(50),
  capital: Joi.string().required().min(2).max(100),
  indicators: Joi.object({
    gdp: Joi.number().required().min(0),
    lifeExpectancy: Joi.number().required().min(0).max(120),
    education: Joi.number().required().min(0).max(100),
    co2Emissions: Joi.number().required().min(0),
    population: Joi.number().required().min(0),
    unemploymentRate: Joi.number().min(0).max(100).allow(null),
    corruptionIndex: Joi.number().min(0).max(100).allow(null),
    happinessScore: Joi.number().min(0).max(10).allow(null)
  }).required()
});

export const validateCountryData = (req, res, next) => {
  const { error, value } = countrySchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Country data validation error',
      message: error.details[0].message,
      details: error.details
    });
  }
  
  req.body = value;
  next();
};