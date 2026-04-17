import React from 'react';

const ProgressIndicator = ({ currentStep, totalSteps, stepName, isProcessing }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isProcessing ? `Processing: ${stepName}` : 'Ready'}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentStep} of {totalSteps}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {isProcessing && (
        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
          Processing data...
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
