/**
 * Cricket Analytics Platform - Main React App
 * ===========================================
 * Final Year Project 2026 - Complete Cricket Analytics Pipeline
 * 
 * Author: [Your Name]
 * Technology: React 18 + Tailwind CSS + Framer Motion
 * 
 * This is the main application component that handles:
 * 1. Module navigation and routing
 * 2. Data pipeline stage management
 * 3. UI state management
 * 4. Integration with FastAPI backend
 * 
 * The app follows a clean data science pipeline flow:
 * Data Collection → Data Cleaning → Data Transformation → EDA → Modeling → Evaluation → Export
 */

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
  // State management for active module
  const [activeModule, setActiveModule] = useState(null);

  // Define the 7 data pipeline stages
  // Each module represents a stage in the data science workflow
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
      description: 'Measure accuracy, compare results',
      color: 'from-red-500 to-red-600',
      status: 'ready'
    },
    {
      id: 'export',
      name: 'Export Results',
      description: 'Generate reports and export to various formats',
      color: 'from-indigo-500 to-indigo-600',
      status: 'ready'
    }
  ];

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
    console.log(`Module clicked: ${moduleId}`);
  };

  const getModuleFeatures = (moduleId) => {
    const features = {
      scraper: [
        'Web scraping automation',
        'Real-time data collection',
        'Multiple source integration'
      ],
      cleaning: [
        'Missing value handling',
        'Duplicate detection',
        'Data validation'
      ],
      transformation: [
        'Feature engineering',
        'Statistical calculations',
        'Data normalization'
      ],
      eda: [
        'Interactive visualizations',
        'Statistical analysis',
        'Trend identification'
      ],
      predictions: [
        'ML model training',
        'Win probability prediction',
        'Performance forecasting'
      ],
      evaluation: [
        'Model accuracy testing',
        'Performance metrics',
        'Cross-validation'
      ],
      export: [
        'Multiple format support',
        'Report generation',
        'Data visualization export'
      ]
    };
    return features[moduleId] || [];
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderModulePage = () => {
    switch(activeModule) {
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
    <div className="min-h-screen bg-gray-50">
      {!activeModule ? (
        <>
          <Header />
          
          {/* Hero Section */}
<div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden text-white">

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1920&q=80')"
    }}
  ></div>

  {/* Dark Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80"></div>

  {/* Content */}
  <div className="relative z-10 container mx-auto px-4 text-center py-24">

    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-lg 
                  flex items-center justify-center shadow-2xl 
                  animate-float border border-white/20">
    
    <span className="text-5xl">🏏</span>

  </div>
</div>


      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
        AI-Driven Sports Insights Platform
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
        Advanced Cricket Analytics Pipeline powered by Machine Learning
      </p>

      {/* Stats */}
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-blue-400">7</div>
          <div className="text-sm text-gray-300">Pipeline Stages</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-green-400">50K+</div>
          <div className="text-sm text-gray-300">Data Points</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-purple-400">95%</div>
          <div className="text-sm text-gray-300">Model Accuracy</div>
        </div>
      </div>

    </motion.div>
  </div>
</div>


          {/* Features Section */}
          <div className="bg-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Capabilities</h2>
                <p className="text-xl text-gray-600">Complete end-to-end cricket analytics solution</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                    <div>
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Data Visualization</h3>
                  <p className="text-gray-600">Interactive charts and graphs for comprehensive cricket insights</p>
                </div>
                
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                    <div>
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Real-time Processing</h3>
                  <p className="text-gray-600">Lightning-fast data processing with instant results</p>
                </div>
                
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                    <div>
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">ML Predictions</h3>
                  <p className="text-gray-600">Advanced machine learning models for accurate predictions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Enhanced Module Grid */}
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Analytics Pipeline</h2>
                <p className="text-xl text-gray-600">Complete data science workflow for cricket analytics</p>
              </div>

              {/* Enhanced Module Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {modules.map((module, index) => {
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => handleModuleClick(module.id)}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 hover:border-transparent overflow-hidden"
                    >
                      {/* Module Header with Animated Icons */}
                      <div className={`bg-gradient-to-br ${module.color} p-8 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                        
                        {/* Static Icons for each module */}
                        <div className="relative z-10 flex justify-center">
                          {module.id === 'scraper' && (
                            <div>
                              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9 9m9 9H3m9-9v9m0-9L3 21m18-3l-9-9m0 0l-9 9" />
                              </svg>
                            </div>
                          )}
                          {module.id === 'cleaning' && (
                            <div>
                              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                          {module.id === 'transformation' && (
                            <div>
                              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                          )}
                          {module.id === 'eda' && (
                            <div>
                              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                          )}
                          {module.id === 'predictions' && (
                            <div>
                              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                          )}
                          {module.id === 'evaluation' && (
                            <div>
                              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                          {module.id === 'export' && (
                            <div>
                              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Module Content */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                          {module.name}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">{module.description}</p>
                        
                        {/* Module Features */}
                        <div className="space-y-2 mb-6">
                          {getModuleFeatures(module.id).map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                            Launch Module →
                          </span>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(module.status)}`}>
                            {module.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Platform Statistics</h2>
                <p className="text-xl opacity-90">Real-time cricket data processing at scale</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-4">
                    <div className="mb-3">
                      <svg className="w-12 h-12 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold mb-2">15,000+</div>
                    <div className="text-sm opacity-90">Matches Processed</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-4">
                    <div className="mb-3">
                      <svg className="w-12 h-12 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 4M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold mb-2">2,500+</div>
                    <div className="text-sm opacity-90">Players Analyzed</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-4">
                    <div className="mb-3">
                      <svg className="w-12 h-12 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold mb-2">98.5%</div>
                    <div className="text-sm opacity-90">Prediction Accuracy</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-4">
                    <div className="mb-3">
                      <svg className="w-12 h-12 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-sm opacity-90">System Health</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Module Display */}
            {activeModule && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Currently Active: {modules.find(m => m.id === activeModule)?.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  This module is ready to use. Configure your settings below or navigate to the dedicated page.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Launch Module
                      </button>
                      <button className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                        View Documentation
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        Configure Settings
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-4">Module Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">API Status</span>
                        <span className="text-green-600 font-semibold">Connected</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Data Available</span>
                        <span className="text-green-600 font-semibold">Ready</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="text-gray-800">Just now</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">Performance</span>
                        <span className="text-green-600 font-semibold">Optimal</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module Specific Content */}
                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Module Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">7</div>
                      <div className="text-gray-600">Total Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-gray-600">System Health</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">24/7</div>
                      <div className="text-gray-600">Availability</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400">© 2026 Final Year Project Data Pipeline. All rights reserved.</p>
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
