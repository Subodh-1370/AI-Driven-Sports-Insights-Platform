import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Header from './components/Header';
import Scraper from './pages/Scraper';
import DataCleaning from './pages/DataCleaning';
import DataTransformation from './pages/DataTransformation';
import EDA from './pages/EDA';
import Predictions from './pages/Predictions';
import Evaluation from './pages/Evaluation';
import Export from './pages/Export';

function App() {
  const [activeModule, setActiveModule] = useState(null);

  const modules = [
    {
      id: 'scraper',
      name: 'Data Collection',
      description: 'Gather sports data from websites, APIs, or datasets',
      color: 'from-blue-500 to-blue-600',
      status: 'ready'
    },
    {
      id: 'cleaning',
      name: 'Data Cleaning',
      description: 'Remove duplicates, handle missing values, fix formats',
      color: 'from-green-500 to-green-600',
      status: 'ready'
    },
    {
      id: 'transformation',
      name: 'Data Transformation',
      description: 'Create features (strike rate, averages, win ratios)',
      color: 'from-purple-500 to-purple-600',
      status: 'ready'
    },
    {
      id: 'eda',
      name: 'Exploratory Data Analysis',
      description: 'Visualize trends, distributions, and correlations',
      color: 'from-orange-500 to-orange-600',
      status: 'ready'
    },
    {
      id: 'predictions',
      name: 'Modeling / Analysis',
      description: 'Apply ML algorithms or statistical analysis',
      color: 'from-pink-500 to-pink-600',
      status: 'ready'
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      description: 'Assess model performance and accuracy',
      color: 'from-red-500 to-red-600',
      status: 'ready'
    },
    {
      id: 'export',
      name: 'Export Data',
      description: 'Download processed data in various formats',
      color: 'from-indigo-500 to-indigo-600',
      status: 'ready'
    }
  ];

  const renderModulePage = () => {
    switch (activeModule) {
      case 'scraper': return <Scraper />;
      case 'cleaning': return <DataCleaning />;
      case 'transformation': return <DataTransformation />;
      case 'eda': return <EDA />;
      case 'predictions': return <Predictions />;
      case 'evaluation': return <Evaluation />;
      case 'export': return <Export />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      {!activeModule ? (
        <>
          <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden text-white">

            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1920&q=80')"
              }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80"></div>

            <div className="relative z-10 container mx-auto px-4 text-center py-24">

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  AI-Driven Sports
                  <span className="block text-blue-400">Data Pipeline</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Complete end-to-end data processing pipeline with machine learning insights for sports analytics
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <button
                  onClick={() => setActiveModule('scraper')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Start Pipeline
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">7</div>
                  <div className="text-sm opacity-90">Pipeline Stages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">50K+</div>
                  <div className="text-sm opacity-90">Records Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">95%</div>
                  <div className="text-sm opacity-90">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm opacity-90">System Health</div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Pipeline Modules
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our comprehensive data pipeline covers everything from data collection to advanced analytics
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveModule(module.id)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {module.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {module.status}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Module Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">7</div>
                <div className="text-gray-600 dark:text-gray-300">Total Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-gray-600 dark:text-gray-300">System Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-gray-600 dark:text-gray-300">Availability</div>
              </div>
            </div>
          </div>

          <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400 dark:text-gray-500">&copy; 2026 Final Year Project Data Pipeline. All rights reserved.</p>
            </div>
          </footer>
        </>
      ) : (
        renderModulePage()
      )}
    </div>
  );
}

export default App;
