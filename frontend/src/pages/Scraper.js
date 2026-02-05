import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Scraper = () => {
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingStatus, setScrapingStatus] = useState('idle');

  const handleStartScraping = async () => {
    setIsScraping(true);
    setScrapingStatus('scraping');
    
    try {
      // Call backend API to start scraping
      const response = await fetch('http://localhost:8000/api/scraper/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setScrapingStatus('completed');
        setTimeout(() => {
          setIsScraping(false);
          setScrapingStatus('idle');
        }, 2000);
      }
    } catch (error) {
      setScrapingStatus('error');
      setIsScraping(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'scraping': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Data Scraping</h1>
                <p className="text-sm text-gray-500">Collect cricket data from various sources</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(scrapingStatus)}`}></div>
              <span className="text-sm text-gray-600">Status: {scrapingStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Season/Tournament</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter season URL"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Player Index</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter player index URL"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Match URLs</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Enter match URLs (one per line)"
                  />
                </div>
              </div>
              
              <button
                onClick={handleStartScraping}
                disabled={isScraping}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isScraping ? 'Scraping...' : 'Start Scraping'}
              </button>
            </div>
          </motion.div>

          {/* Status Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Scraping Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Current Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(scrapingStatus)}`}>
                    {scrapingStatus.toUpperCase()}
                  </span>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Data Sources</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Match Data Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Player Data Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Delivery Data Available</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Recent Activity</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Last Scraping:</span>
                      <span className="font-medium">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Matches:</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Players:</span>
                      <span className="font-medium">48</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Indicator */}
        {isScraping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md mx-4">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-blue-600 border-t-transparent border-l-transparent"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Scraping in Progress</h3>
                  <p className="text-gray-600">Collecting cricket data from sources...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Scraper;
