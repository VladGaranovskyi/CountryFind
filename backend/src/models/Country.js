import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  iso_code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: [2, 3]
  },
  flag: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  capital: {
    type: String,
    required: true,
    trim: true
  },
  indicators: {
    gdp: {
      type: Number,
      required: true,
      min: 0
    },
    lifeExpectancy: {
      type: Number,
      required: true,
      min: 0,
      max: 120
    },
    education: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    co2Emissions: {
      type: Number,
      required: true,
      min: 0
    },
    population: {
      type: Number,
      required: true,
      min: 0
    },
    unemploymentRate: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    corruptionIndex: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    happinessScore: {
      type: Number,
      default: null,
      min: 0,
      max: 10
    }
  },
  embedding: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Embedding vector cannot be empty'
    }
  },
  metadata: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    dataSource: {
      type: String,
      default: 'World Bank'
    },
    confidence: {
      type: Number,
      default: 1.0,
      min: 0,
      max: 1
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
countrySchema.index({ name: 1 });
countrySchema.index({ iso_code: 1 });
countrySchema.index({ region: 1 });
countrySchema.index({ 'indicators.gdp': -1 });
countrySchema.index({ 'indicators.lifeExpectancy': -1 });

// Virtual for formatted GDP
countrySchema.virtual('formattedGDP').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(this.indicators.gdp);
});

// Method to calculate similarity score (fallback if vector search fails)
countrySchema.methods.calculateSimilarity = function(otherCountry) {
  const weights = {
    gdp: 0.25,
    lifeExpectancy: 0.20,
    education: 0.20,
    co2Emissions: 0.15,
    population: 0.10,
    unemploymentRate: 0.05,
    happinessScore: 0.05
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const [indicator, weight] of Object.entries(weights)) {
    const val1 = this.indicators[indicator];
    const val2 = otherCountry.indicators[indicator];
    
    if (val1 !== null && val1 !== undefined && val2 !== null && val2 !== undefined) {
      const maxVal = Math.max(val1, val2);
      const similarity = maxVal > 0 ? 1 - Math.abs(val1 - val2) / maxVal : 1;
      totalScore += similarity * weight;
      totalWeight += weight;
    }
  }

  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

// Static method to get countries for dropdown
countrySchema.statics.getCountriesForDropdown = function() {
  return this.find({}, 'name iso_code flag region').sort({ name: 1 });
};

export default mongoose.model('Country', countrySchema);