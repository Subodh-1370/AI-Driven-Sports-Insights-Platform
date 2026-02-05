import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BoltIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Evaluation = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState({
    accuracy: 94.2,
    precision: 92.8,
    recall: 89.5,
    f1Score: 91.1
  });

  const modelMetrics = [
    { name: 'Win Prediction', accuracy: 94.2, precision: 92.8, recall: 89.5, f1Score: 91.1 },
    { name: 'Score Prediction', accuracy: 91.7, precision: 89.3, recall: 87.2, f1Score: 88.2 },
    { name: 'Player Performance', accuracy: 88.9, precision: 86.5, recall: 84.8, f1Score: 85.6 },
    { name: 'Momentum Analysis', accuracy: 92.4, precision: 90.1, recall: 88.3, f1Score: 89.2 }
  ];

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    
    // Simulate evaluation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setEvaluationResults({
      accuracy: 94.2 + Math.random() * 2,
      precision: 92.8 + Math.random() * 2,
      recall: 89.5 + Math.random() * 2,
      f1Score: 91.1 + Math.random() * 2
    });
    
    setIsEvaluating(false);
  };

  const getMetricColor = (value) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricBgColor = (value) => {
    if (value >= 90) return 'bg-green-50';
    if (value >= 80) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <BoltIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Evaluation</h1>
                <p className="text-sm text-gray-500">Measure accuracy, compare results</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Models Evaluated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Overall Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Overall Performance</h2>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${getMetricBgColor(evaluationResults.accuracy)}`}>
                  <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                  <div className={`text-2xl font-bold ${getMetricColor(evaluationResults.accuracy)}`}>
                    {evaluationResults.accuracy.toFixed(1)}%
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${getMetricBgColor(evaluationResults.precision)}`}>
                  <div className="text-sm text-gray-600 mb-1">Precision</div>
                  <div className={`text-2xl font-bold ${getMetricColor(evaluationResults.precision)}`}>
                    {evaluationResults.precision.toFixed(1)}%
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${getMetricBgColor(evaluationResults.recall)}`}>
                  <div className="text-sm text-gray-600 mb-1">Recall</div>
                  <div className={`text-2xl font-bold ${getMetricColor(evaluationResults.recall)}`}>
                    {evaluationResults.recall.toFixed(1)}%
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${getMetricBgColor(evaluationResults.f1Score)}`}>
                  <div className="text-sm text-gray-600 mb-1">F1 Score</div>
                  <div className={`text-2xl font-bold ${getMetricColor(evaluationResults.f1Score)}`}>
                    {evaluationResults.f1Score.toFixed(1)}%
                  </div>
                </div>
              </div>

              <button
                onClick={handleRunEvaluation}
                disabled={isEvaluating}
                className={`w-full mt-6 px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 ${
                  isEvaluating
                    ? 'bg-yellow-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } disabled:bg-gray-400 disabled:cursor-not-allowed`}
              >
                {isEvaluating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white border-t-transparent border-l-transparent"></div>
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <ChartBarIcon className="w-4 h-4" />
                    <span>Run Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Model Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Model Comparison</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Model</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Accuracy</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Precision</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Recall</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">F1 Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-800">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelMetrics.map((model, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{model.name}</td>
                        <td className={`py-3 px-4 text-center font-semibold ${getMetricColor(model.accuracy)}`}>
                          {model.accuracy.toFixed(1)}%
                        </td>
                        <td className={`py-3 px-4 text-center font-semibold ${getMetricColor(model.precision)}`}>
                          {model.precision.toFixed(1)}%
                        </td>
                        <td className={`py-3 px-4 text-center font-semibold ${getMetricColor(model.recall)}`}>
                          {model.recall.toFixed(1)}%
                        </td>
                        <td className={`py-3 px-4 text-center font-semibold ${getMetricColor(model.f1Score)}`}>
                          {model.f1Score.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            EXCELLENT
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Evaluation Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Performance Insights</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">🎯 Best Performing Model</h3>
                <p className="text-sm text-gray-700">Win Prediction model achieved 94.2% accuracy, making it the most reliable for match outcome predictions.</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">📊 Consistent Performance</h3>
                <p className="text-sm text-gray-700">All models maintain above 85% accuracy, showing robust performance across different prediction tasks.</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Areas for Improvement</h3>
                <p className="text-sm text-gray-700">Player Performance model could benefit from additional feature engineering to improve recall metrics.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Benchmark Comparison</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Our Models</span>
                <span className="font-bold text-green-600">91.7%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Industry Average</span>
                <span className="font-bold text-yellow-600">87.3%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Baseline Model</span>
                <span className="font-bold text-red-600">72.8%</span>
              </div>
              
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">🏆 Achievement</h3>
                <p className="text-sm text-gray-700">Our models outperform industry average by 4.4% and baseline by 18.9%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
