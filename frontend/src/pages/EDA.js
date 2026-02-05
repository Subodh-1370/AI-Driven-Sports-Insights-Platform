import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const EDA = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysisTypes = [
    { id: 'overview', name: 'Data Overview', icon: '📊', description: 'Summary statistics and metrics' },
    { id: 'scoring', name: 'Scoring Analysis', icon: '🏏', description: 'Run distribution and patterns' },
    { id: 'bowling', name: 'Bowling Analysis', icon: '🎯', description: 'Wicket patterns and economy' },
    { id: 'venue', name: 'Venue Performance', icon: '🏟', description: 'Ground-wise statistics' },
    { id: 'toss', name: 'Toss Impact', icon: '🪙', description: 'Toss decision analysis' }
  ];

  const handleAnalysis = async (type) => {
    setSelectedAnalysis(type);
    setIsAnalyzing(true);
    
    try {
      // Call backend API for analysis
      const response = await fetch(`http://localhost:8000/api/eda/analyze/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Analysis completed:', data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Exploratory Analysis</h1>
                <p className="text-sm text-gray-500">Analyze and visualize cricket data</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Data Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Analysis Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Analysis Type</h2>
              
              <div className="space-y-2">
                {analysisTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleAnalysis(type.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedAnalysis === type.id
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {analysisTypes.find(a => a.id === selectedAnalysis)?.name}
              </h2>
              
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-r-2 border-purple-600 border-t-transparent border-l-transparent"></div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">Analyzing Data...</h3>
                    <p className="text-gray-600">Please wait while we process your request</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Sample Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Top Scorers</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">1. Virat Kohli</span>
                          <span className="font-bold text-gray-800">973 runs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">2. Rohit Sharma</span>
                          <span className="font-bold text-gray-800">892 runs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">3. David Warner</span>
                          <span className="font-bold text-gray-800">856 runs</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Wicket Takers</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">1. Jasprit Bumrah</span>
                          <span className="font-bold text-gray-800">45 wickets</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">2. Mitchell Starc</span>
                          <span className="font-bold text-gray-800">38 wickets</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">3. Ravichandran Ashwin</span>
                          <span className="font-bold text-gray-800">32 wickets</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Average Score:</span>
                        <span className="font-bold text-blue-800">285.6</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Highest Score:</span>
                        <span className="font-bold text-blue-800">264</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Matches:</span>
                        <span className="font-bold text-blue-800">156</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Data Range:</span>
                        <span className="font-bold text-blue-800">2020-2024</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Venue Analysis */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">Venue Performance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">M. Chinnaswamy</span>
                        <span className="font-bold text-green-800">Avg: 312</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Eden Gardens</span>
                        <span className="font-bold text-green-800">Avg: 298</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wankhede</span>
                        <span className="font-bold text-green-800">Avg: 285</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Export Options */}
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Export Analysis</h2>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export to PDF
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Export to Excel
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Generate Report
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EDA;
