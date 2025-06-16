import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BarChart3, Globe, TrendingUp, Award } from 'lucide-react';
import { countries, calculateSimilarity } from '../data/countries';

interface SimilarityResult {
  country: typeof countries[0];
  score: number;
  reasons: string[];
}

const ResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SimilarityResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const country = searchParams.get('country');
    const description = searchParams.get('description');

    if (country) {
      setSearchQuery(country);
      const referenceCountry = countries.find(c => c.name === country);
      if (referenceCountry) {
        const similarities = countries
          .filter(c => c.name !== country)
          .map(c => ({
            country: c,
            ...calculateSimilarity(referenceCountry, c)
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        
        setResults(similarities);
      }
    } else if (description) {
      setSearchQuery(description);
      // Mock similarity calculation based on description
      const similarities = countries
        .map(c => ({
          country: c,
          score: Math.random() * 0.4 + 0.6, // Random score between 0.6-1.0
          reasons: ['Economic indicators match', 'Similar development level', 'Environmental factors align']
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      setResults(similarities);
    }

    setTimeout(() => setLoading(false), 1000);
  }, [searchParams]);

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.9) return <Award className="w-4 h-4" />;
    if (score >= 0.8) return <TrendingUp className="w-4 h-4" />;
    return <BarChart3 className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/search"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Search
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Similar Countries Found
          </h1>
          <p className="text-slate-600 text-lg">
            Based on your search for: <span className="font-semibold text-slate-800">"{searchQuery}"</span>
          </p>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results.map((result, index) => (
            <div
              key={result.country.name}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="text-4xl">{result.country.flag}</div>
                      <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                        {result.country.name}
                      </h2>
                      <p className="text-slate-600">
                        {result.country.region} • {result.country.capital}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getScoreColor(result.score)}`}>
                    {getScoreIcon(result.score)}
                    <span className="font-bold">
                      {(result.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Key Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800">
                      ${(result.country.gdp / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-slate-600">GDP per Capita</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800">
                      {result.country.lifeExpectancy}y
                    </div>
                    <div className="text-sm text-slate-600">Life Expectancy</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800">
                      {result.country.education}%
                    </div>
                    <div className="text-sm text-slate-600">Education Index</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800">
                      {result.country.co2Emissions}t
                    </div>
                    <div className="text-sm text-slate-600">CO₂ per Capita</div>
                  </div>
                </div>

                {/* Similarity Reasons */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Why this country is similar:</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.reasons.map((reason, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/dashboard?countries=${result.country.name}`}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors group"
                  >
                    <BarChart3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    View in Dashboard
                  </Link>
                  <button className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors group">
                    <Globe className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Results */}
        <div className="mt-12 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Analyze All Results in Dashboard
            <ExternalLink className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;