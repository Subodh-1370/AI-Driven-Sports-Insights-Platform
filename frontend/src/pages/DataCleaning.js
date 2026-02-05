import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const DataCleaning = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('idle');
  const [progress, setProgress] = useState(0);

  const handleStartCleaning = async () => {
    setIsProcessing(true);
    setProcessingStep('cleaning');
    setProgress(25);
    
    try {
      // Simulate cleaning steps
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingStep('transforming');
      setProgress(50);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingStep('validating');
      setProgress(75);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingStep('completed');
      setProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep('idle');
        setProgress(0);
      }, 1000);
    } catch (error) {
      setProcessingStep('error');
      setIsProcessing(false);
    }
  };

  const getStatusColor = (step) => {
    switch(step) {
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'cleaning': return 'bg-blue-100 text-blue-800';
      case 'transforming': return 'bg-yellow-100 text-yellow-800';
      case 'validating': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const steps = [
    { id: 'cleaning', name: 'Cleaning Raw Data', description: 'Remove duplicates and fix errors' },
    { id: 'transforming', name: 'Transforming Data', description: 'Convert to analysis format' },
    { id: 'validating', name: 'Validating Data', description: 'Check data integrity' },
    { id: 'completed', name: 'Processing Complete', description: 'Data ready for analysis' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <FunnelIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Data Cleaning</h1>
                <p className="text-sm text-gray-500">Process and clean raw cricket data</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(processingStep)}`}></div>
              <span className="text-sm text-gray-600">Status: {processingStep}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Processing Control</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleStartCleaning}
                  disabled={isProcessing}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isProcessing ? 'Processing...' : 'Start Data Cleaning'}
                </button>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Processing Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Processing Pipeline</h2>
              
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      processingStep === step.id 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        processingStep === step.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{step.name}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(step.id)}`}>
                        {processingStep === step.id && (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent border-l-transparent"></div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Data Status */}
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Data Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DocumentArrowDownIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">Raw Data</h3>
                <p className="text-2xl font-bold text-blue-600">2.3 GB</p>
                <p className="text-sm text-gray-600">15,234 records</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <FunnelIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-yellow-800">Processing</h3>
                <p className="text-2xl font-bold text-yellow-600">1.8 GB</p>
                <p className="text-sm text-gray-600">12,456 records</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DocumentArrowDownIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800">Clean Data</h3>
                <p className="text-2xl font-bold text-green-600">1.2 GB</p>
                <p className="text-sm text-gray-600">12,234 records</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DataCleaning;
