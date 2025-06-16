import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { countries } from '../data/countries';
import { Globe, BarChart3, TrendingUp, Users, Leaf, DollarSign } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['United States', 'Germany', 'Japan', 'Brazil']);
  const [activeMetric, setActiveMetric] = useState<'gdp' | 'lifeExpectancy' | 'education' | 'co2Emissions'>('gdp');

  const selectedCountryData = countries.filter(c => selectedCountries.includes(c.name));

  const metrics = [
    { key: 'gdp', label: 'GDP per Capita', icon: DollarSign, color: '#3b82f6', unit: '$' },
    { key: 'lifeExpectancy', label: 'Life Expectancy', icon: Users, color: '#10b981', unit: 'years' },
    { key: 'education', label: 'Education Index', icon: BarChart3, color: '#f59e0b', unit: '%' },
    { key: 'co2Emissions', label: 'CO₂ Emissions', icon: Leaf, color: '#ef4444', unit: 't per capita' }
  ];

  const chartData = selectedCountryData.map(country => ({
    name: country.name.length > 12 ? country.name.substring(0, 12) + '...' : country.name,
    fullName: country.name,
    gdp: country.gdp,
    lifeExpectancy: country.lifeExpectancy,
    education: country.education,
    co2Emissions: country.co2Emissions,
    flag: country.flag
  }));

  const regionData = countries.reduce((acc, country) => {
    acc[country.region] = (acc[country.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(regionData).map(([region, count]) => ({
    name: region,
    value: count
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Country Analytics Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Interactive visualizations and comparisons of global development indicators
          </p>
        </div>

        {/* Country Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Select Countries to Compare</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {countries.slice(0, 18).map(country => (
              <button
                key={country.name}
                onClick={() => {
                  if (selectedCountries.includes(country.name)) {
                    setSelectedCountries(prev => prev.filter(c => c !== country.name));
                  } else if (selectedCountries.length < 6) {
                    setSelectedCountries(prev => [...prev, country.name]);
                  }
                }}
                className={`p-3 rounded-xl text-center transition-all duration-200 ${
                  selectedCountries.includes(country.name)
                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                    : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100 text-slate-700'
                }`}
                disabled={!selectedCountries.includes(country.name) && selectedCountries.length >= 6}
              >
                <div className="text-2xl mb-1">{country.flag}</div>
                <div className="text-xs font-medium truncate">{country.name}</div>
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-3">
            Select up to 6 countries for comparison ({selectedCountries.length}/6 selected)
          </p>
        </div>

        {/* Metric Selection */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key as any)}
              className={`p-6 rounded-2xl transition-all duration-200 ${
                activeMetric === key
                  ? 'bg-white shadow-lg border-2 border-blue-500'
                  : 'bg-white shadow-sm border border-slate-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-center mb-3">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: activeMetric === key ? color + '20' : '#f1f5f9' }}
                >
                  <Icon 
                    className="w-6 h-6" 
                    style={{ color: activeMetric === key ? color : '#64748b' }}
                  />
                </div>
              </div>
              <h3 className={`font-semibold ${
                activeMetric === key ? 'text-slate-800' : 'text-slate-600'
              }`}>
                {label}
              </h3>
            </button>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">
              {metrics.find(m => m.key === activeMetric)?.label} Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    `${metrics.find(m => m.key === activeMetric)?.unit}${typeof value === 'number' ? value.toLocaleString() : value}`,
                    metrics.find(m => m.key === activeMetric)?.label
                  ]}
                  labelFormatter={(label) => chartData.find(d => d.name === label)?.fullName || label}
                />
                <Bar 
                  dataKey={activeMetric} 
                  fill={metrics.find(m => m.key === activeMetric)?.color}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Development Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="gdp" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  name="GDP per Capita"
                />
                <Line 
                  type="monotone" 
                  dataKey="lifeExpectancy" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  name="Life Expectancy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Regional Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Countries by Region</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Top Performers</h3>
            <div className="space-y-4">
              {countries
                .sort((a, b) => b[activeMetric] - a[activeMetric])
                .slice(0, 5)
                .map((country, index) => (
                  <div key={country.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-slate-600 w-6">#{index + 1}</span>
                      <span className="text-xl">{country.flag}</span>
                      <span className="font-medium text-slate-800">{country.name}</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {metrics.find(m => m.key === activeMetric)?.unit}
                      {country[activeMetric].toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Global Overview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Total Countries</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{countries.length}</span>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Avg Life Expectancy</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {(countries.reduce((sum, c) => sum + c.lifeExpectancy, 0) / countries.length).toFixed(1)} years
                </span>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center space-x-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Avg GDP per Capita</span>
                </div>
                <span className="text-2xl font-bold text-amber-600">
                  ${(countries.reduce((sum, c) => sum + c.gdp, 0) / countries.length / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;