import React, { useState } from 'react';
import { Upload, RefreshCw, Database, FileText, Shield, Settings, Save, AlertTriangle, Globe, MessageCircle } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'data' | 'worldbank' | 'settings' | 'logs'>('data');
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('2024-01-15 14:30:00');
  const [syncResults, setSyncResults] = useState<any>(null);

  const handleDataRefresh = async () => {
    setIsUploading(true);
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      setLastUpdate(new Date().toLocaleString());
    }, 3000);
  };

  const handleWorldBankSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/worldbank/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setSyncResults(data.data);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error('World Bank sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const tabs = [
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'worldbank', label: 'World Bank Sync', icon: Globe },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'logs', label: 'Activity Logs', icon: FileText }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Admin Panel
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Manage country data, World Bank integration, system settings, and monitor application performance
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Admin Access Required</h3>
              <p className="text-amber-700 text-sm">
                This section requires administrative privileges. Changes made here will affect all users of the system.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-1 p-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">Country Data Management</h2>
                  
                  {/* Data Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <Database className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Total Records</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">195</span>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <RefreshCw className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Last Updated</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">{lastUpdate}</span>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <Upload className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-800">Data Sources</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">5</span>
                    </div>
                  </div>

                  {/* Data Actions */}
                  <div className="space-y-4">
                    <div className="p-6 border border-slate-200 rounded-xl">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Refresh Country Data</h3>
                      <p className="text-slate-600 mb-4">
                        Update all country indicators from external data sources (World Bank, UN, etc.)
                      </p>
                      <button
                        onClick={handleDataRefresh}
                        disabled={isUploading}
                        className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          isUploading
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isUploading ? 'animate-spin' : ''}`} />
                        {isUploading ? 'Refreshing Data...' : 'Refresh All Data'}
                      </button>
                    </div>

                    <div className="p-6 border border-slate-200 rounded-xl">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Upload CSV Data</h3>
                      <p className="text-slate-600 mb-4">
                        Upload a CSV file with country data to add or update records
                      </p>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept=".csv"
                          className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors">
                          <Upload className="w-4 h-4 mr-2 inline" />
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* World Bank Tab */}
            {activeTab === 'worldbank' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">World Bank Data Integration</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <Globe className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">World Bank API Integration</h3>
                      <p className="text-blue-700 text-sm mb-4">
                        Automatically sync country data from the World Bank's public API. This includes GDP, life expectancy, 
                        education indicators, CO2 emissions, and other development metrics.
                      </p>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• GDP per capita (current US$)</li>
                        <li>• Life expectancy at birth</li>
                        <li>• Adult literacy rate</li>
                        <li>• CO2 emissions per capita</li>
                        <li>• Population data</li>
                        <li>• Unemployment rates</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-slate-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Sync World Bank Data</h3>
                  <p className="text-slate-600 mb-4">
                    Fetch the latest country indicators from World Bank API and update the database with current data.
                  </p>
                  
                  {syncResults && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Last Sync Results:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Successfully processed: </span>
                          <span className="font-bold text-green-800">{syncResults.success}</span>
                        </div>
                        <div>
                          <span className="text-red-700">Errors: </span>
                          <span className="font-bold text-red-800">{syncResults.errors?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleWorldBankSync}
                    disabled={isSyncing}
                    className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      isSyncing
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <Globe className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing World Bank Data...' : 'Sync World Bank Data'}
                  </button>
                </div>

                <div className="p-6 border border-slate-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Available Indicators</h3>
                  <p className="text-slate-600 mb-4">
                    View all available World Bank indicators that can be integrated into the system.
                  </p>
                  <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                    <Database className="w-4 h-4 mr-2 inline" />
                    View Indicators
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">System Configuration</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Similarity Threshold
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.0"
                        step="0.05"
                        defaultValue="0.7"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0.5</span>
                        <span>1.0</span>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Max Results per Query
                      </label>
                      <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="10">10 results</option>
                        <option value="20">20 results</option>
                        <option value="50">50 results</option>
                      </select>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm font-medium text-slate-700">Enable AI Chat Assistant</span>
                      </label>
                      <p className="text-xs text-slate-500 mt-1">
                        Allow users to interact with the AI-powered country analysis assistant
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <h3 className="font-semibold text-slate-800 mb-3">API Configuration</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Vector Search API Endpoint
                          </label>
                          <input
                            type="url"
                            placeholder="https://api.mongodb.com/vector-search"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Rate Limit (requests/minute)
                          </label>
                          <input
                            type="number"
                            defaultValue="100"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl">
                      <h3 className="font-semibold text-slate-800 mb-3">Chat Assistant Settings</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Response Temperature
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.1"
                            defaultValue="0.7"
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>Conservative</span>
                            <span>Creative</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Max Response Length
                          </label>
                          <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="512">Short (512 tokens)</option>
                            <option value="1024" selected>Medium (1024 tokens)</option>
                            <option value="2048">Long (2048 tokens)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">System Activity Logs</h2>
                
                <div className="space-y-3">
                  {[
                    { time: '2024-01-15 14:30:15', action: 'World Bank data sync completed', status: 'success' },
                    { time: '2024-01-15 14:28:03', action: 'AI chat assistant query processed', status: 'info' },
                    { time: '2024-01-15 14:25:03', action: 'User searched for "Germany"', status: 'info' },
                    { time: '2024-01-15 14:20:45', action: 'CSV upload: countries.csv', status: 'success' },
                    { time: '2024-01-15 14:15:22', action: 'API rate limit exceeded for IP 192.168.1.1', status: 'warning' },
                    { time: '2024-01-15 14:10:11', action: 'System backup completed', status: 'success' },
                    { time: '2024-01-15 14:05:33', action: 'Vertex AI embedding generation started', status: 'info' },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          log.status === 'success' ? 'bg-green-500' :
                          log.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-slate-800">{log.action}</p>
                          <p className="text-sm text-slate-500">{log.time}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.status === 'success' ? 'bg-green-100 text-green-700' :
                        log.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;