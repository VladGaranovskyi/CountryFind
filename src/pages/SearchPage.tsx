import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { countries } from '../data/countries';

const SearchPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [textDescription, setTextDescription] = useState('');
  const [searchMode, setSearchMode] = useState<'country' | 'description'>('country');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchMode === 'country' && selectedCountry) {
      navigate(`/results?country=${encodeURIComponent(selectedCountry)}`);
    } else if (searchMode === 'description' && textDescription.trim()) {
      navigate(`/results?description=${encodeURIComponent(textDescription)}`);
    }
  };

  const isSearchDisabled = 
    (searchMode === 'country' && !selectedCountry) || 
    (searchMode === 'description' && !textDescription.trim());

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Country Similarity
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
            Find Your Perfect
            <span className="block text-blue-600">Country Match</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose a reference country or describe your ideal country characteristics to discover the most similar nations worldwide
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => setSearchMode('country')}
              className={`flex-1 p-4 rounded-xl font-medium transition-all duration-200 ${
                searchMode === 'country'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Globe className="w-5 h-5 inline mr-2" />
              Select Country
            </button>
            <button
              onClick={() => setSearchMode('description')}
              className={`flex-1 p-4 rounded-xl font-medium transition-all duration-200 ${
                searchMode === 'description'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Search className="w-5 h-5 inline mr-2" />
              Describe Characteristics
            </button>
          </div>

          {/* Search Forms */}
          {searchMode === 'country' ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="country-select" className="block text-sm font-medium text-slate-700 mb-3">
                  Select a reference country
                </label>
                <select
                  id="country-select"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                >
                  <option value="">Choose a country...</option>
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCountry && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-blue-800 font-medium">
                    Selected: {countries.find(c => c.name === selectedCountry)?.flag} {selectedCountry}
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    We'll find countries with similar economic, social, and environmental indicators
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="description-input" className="block text-sm font-medium text-slate-700 mb-3">
                  Describe your ideal country characteristics
                </label>
                <textarea
                  id="description-input"
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  rows={6}
                  placeholder="e.g., developing country with high education levels, low CO₂ emissions, strong economy, good healthcare system..."
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-amber-800 text-sm">
                  <strong>Tip:</strong> Be specific about economic indicators (GDP, unemployment), social factors (education, healthcare), and environmental aspects (CO₂ emissions, renewable energy) for better results.
                </p>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSearch}
              disabled={isSearchDisabled}
              className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                isSearchDisabled
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl group'
              }`}
            >
              <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Find Similar Countries
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Sample Searches */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Popular Searches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'United States',
              'Germany',
              'Japan',
              'Brazil',
              'South Korea',
              'Canada'
            ].map((country) => (
              <button
                key={country}
                onClick={() => {
                  setSearchMode('country');
                  setSelectedCountry(country);
                }}
                className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <span className="text-slate-700 group-hover:text-blue-700 font-medium">
                  {countries.find(c => c.name === country)?.flag} {country}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;