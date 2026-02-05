import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, PlayIcon } from '@heroicons/react/24/outline';

const DataTransformation = () => {
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationStatus, setTransformationStatus] = useState('ready');
  const [progress, setProgress] = useState(0);

  const transformationSteps = [
    { name: 'Calculate Strike Rates', status: 'completed', description: 'Batting strike rate calculation' },
    { name: 'Compute Averages', status: 'completed', description: 'Batting and bowling averages' },
    { name: 'Win Ratios', status: 'processing', description: 'Team win percentage calculation' },
    { name: 'Feature Engineering', status: 'pending', description: 'Create advanced features' },
    { name: 'Data Validation', status: 'pending', description: 'Validate transformed data' }
  ];

  const handleStartTransformation = async () => {
    setIsTransforming(true);
    setTransformationStatus('processing');
    setProgress(0);

    // Simulate transformation process
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setTransformationStatus('completed');
    setIsTransforming(false);
  };

  const features = [
    { name: 'Batting Strike Rate', value: '125.4', unit: 'runs/100 balls' },
    { name: 'Bowling Economy', value: '7.2', unit: 'runs/over' },
    { name: 'Team Win Ratio', value: '68.5', unit: '%' },
    { name: 'Player Form Index', value: '0.82', unit: 'normalized' },
    { name: 'Venue Advantage', value: '1.15', unit: 'multiplier' },
    { name: 'Momentum Score', value: '0.76', unit: 'normalized' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Data Transformation</h1>
                <p className="text-sm text-gray-500">Create features (strike rate, averages, win ratios)</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${transformationStatus === 'completed' ? 'bg-green-500' : transformationStatus === 'processing' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600 capitalize">{transformationStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transformation Control */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Transformation Control</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleStartTransformation}
                  disabled={isTransforming}
                  className={`w-full px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 ${
                    isTransforming
                      ? 'bg-yellow-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {isTransforming ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white border-t-transparent border-l-transparent"></div>
                      <span>Transforming...</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4" />
                      <span>Start Transformation</span>
                    </>
                  )}
                </button>

                {isTransforming && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-purple-600 font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Transformation Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Transformation Pipeline</h2>
              
              <div className="space-y-3">
                {transformationSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {step.status === 'completed' && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {step.status === 'processing' && (
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                      {step.status === 'pending' && (
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{step.name}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        step.status === 'completed' ? 'bg-green-100 text-green-800' :
                        step.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Generated Features */}
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Generated Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">{feature.name}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-purple-600">{feature.value}</span>
                    <span className="text-sm text-purple-600">{feature.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Transformation Summary */}
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Transformation Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">15,234</div>
                <div className="text-sm text-gray-600">Records Processed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-sm text-gray-600">Features Created</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">98.5%</div>
                <div className="text-sm text-gray-600">Data Quality</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">2.3s</div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DataTransformation;
