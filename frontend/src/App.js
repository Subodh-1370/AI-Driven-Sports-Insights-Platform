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

// Import Heroicons for clean, modern icons
import {
  HomeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

// Import custom components
import Header from './components/Header';

// Import page components for each pipeline stage
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
      icon: HomeIcon,
      color: 'from-blue-500 to-blue-600',
      status: 'ready'
    },
    {
      id: 'cleaning',
      name: 'Data Cleaning',
      description: 'Remove duplicates, handle missing values, fix formats',
      icon: FunnelIcon,
      color: 'from-green-500 to-green-600',
      status: 'ready'
    },
    {
      id: 'transformation',
      name: 'Data Transformation',
      description: 'Create features (strike rate, averages, win ratios)',
      icon: ArrowTrendingUpIcon,
      color: 'from-purple-500 to-purple-600',
      status: 'ready'
    },
    {
      id: 'eda',
      name: 'Exploratory Data Analysis',
      description: 'Visualize trends, distributions, and correlations',
      icon: ChartBarIcon,
      color: 'from-orange-500 to-orange-600',
      status: 'ready'
    },
    {
      id: 'predictions',
      name: 'Modeling / Analysis',
      description: 'Apply ML algorithms or statistical analysis',
      icon: SparklesIcon,
      color: 'from-pink-500 to-pink-600',
      status: 'ready'
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      description: 'Measure accuracy, compare results',
      icon: BoltIcon,
      color: 'from-red-500 to-red-600',
      status: 'ready'
    },
    {
      id: 'export',
      name: 'Export Results',
      description: 'Save cleaned data, graphs, and predictions',
      icon: DocumentArrowDownIcon,
      color: 'from-indigo-500 to-indigo-600',
      status: 'ready'
    }
  ];

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
    console.log(`Module clicked: ${moduleId}`);
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">Final Year Project Data Pipeline</h1>
                <p className="text-xl opacity-90">Complete sports analytics pipeline from data collection to results</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Data Pipeline Stages</h2>
              <p className="text-gray-600 text-lg">Follow the complete data science workflow step by step</p>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleModuleClick(module.id)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300"
                  >
                    <div className={`bg-gradient-to-r ${module.color} p-6 rounded-t-xl`}>
                      <Icon className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{module.name}</h3>
                      <p className="text-gray-600 mb-4">{module.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Click to launch</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(module.status)}`}>
                          {module.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
          </div>

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
