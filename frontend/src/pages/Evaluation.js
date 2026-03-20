import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BoltIcon, 
  ChartBarIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Evaluation = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [error, setError] = useState(null);
  const [lastEvaluation, setLastEvaluation] = useState(null);

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/evaluation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Evaluation failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setEvaluationResults(result.data);
        setLastEvaluation(new Date().toLocaleTimeString());
      } else {
        setError(result.message || 'Evaluation failed');
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      setError(error.message);
    } finally {
      setIsEvaluating(false);
    }
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

  const getStatusBadge = (accuracy) => {
    if (accuracy >= 95) return { text: 'OUTSTANDING', color: 'bg-green-100 text-green-800' };
    if (accuracy >= 90) return { text: 'EXCELLENT', color: 'bg-blue-100 text-blue-800' };
    if (accuracy >= 85) return { text: 'GOOD', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'NEEDS IMPROVEMENT', color: 'bg-red-100 text-red-800' };
  };

  const ModelComparisonTable = ({ models }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-800">Model</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-800">Type</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-800">Accuracy</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-800">Precision</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-800">Recall</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-800">F1 Score</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-800">Status</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-800">Samples</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model, index) => {
            const status = getStatusBadge(model.accuracy);
            return (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{model.name}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {model.type}
                  </span>
                </td>
                <td className={`py-3 px-4 text-center font-semibold ${getMetricColor(model.accuracy)}`}>
                  {model.accuracy.toFixed(1)}%
                </td>
                <td className={`py-3 px-4 text-center font-semibold ${getMetricColor(model.precision)}`}>
                  {model.precision.toFixed(1)}%
                </td>
                <td className={`py-3 px-4 text-center font-semibold ${getMetricColor(model.recall)}`}>
                  {model.recall.toFixed(1)}%
                </td>
                <td className={`py-3 px-4 text-center font-semibold ${getMetricColor(model.f1_score)}`}>
                  {model.f1_score.toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.text}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">
                  {model.training_samples}/{model.test_samples}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

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
        {/* Last Evaluation Info */}
        {lastEvaluation && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Last evaluation completed at {lastEvaluation}</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Overall Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Overall Performance</h2>
              
              {evaluationResults ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${getMetricBgColor(evaluationResults.overall_metrics.accuracy)}`}>
                    <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                    <div className={`text-2xl font-bold ${getMetricColor(evaluationResults.overall_metrics.accuracy)}`}>
                      {evaluationResults.overall_metrics.accuracy.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${getMetricBgColor(evaluationResults.overall_metrics.precision)}`}>
                    <div className="text-sm text-gray-600 mb-1">Precision</div>
                    <div className={`text-2xl font-bold ${getMetricColor(evaluationResults.overall_metrics.precision)}`}>
                      {evaluationResults.overall_metrics.precision.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${getMetricBgColor(evaluationResults.overall_metrics.recall)}`}>
                    <div className="text-sm text-gray-600 mb-1">Recall</div>
                    <div className={`text-2xl font-bold ${getMetricColor(evaluationResults.overall_metrics.recall)}`}>
                      {evaluationResults.overall_metrics.recall.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${getMetricBgColor(evaluationResults.overall_metrics.f1_score)}`}>
                    <div className="text-sm text-gray-600 mb-1">F1 Score</div>
                    <div className={`text-2xl font-bold ${getMetricColor(evaluationResults.overall_metrics.f1_score)}`}>
                      {evaluationResults.overall_metrics.f1_score.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No evaluation results yet. Click "Run Evaluation" to start.</p>
                </div>
              )}

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
              
              {evaluationResults ? (
                <ModelComparisonTable models={evaluationResults.model_results} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Run evaluation to see detailed model comparison.</p>
                </div>
              )}
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
            
            {evaluationResults ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">🎯 Best Performing Model</h3>
                  <p className="text-sm text-gray-700">
                    {evaluationResults.model_results.reduce((best, model) => 
                      model.accuracy > best.accuracy ? model : best
                    ).name} achieved {Math.max(...evaluationResults.model_results.map(m => m.accuracy)).toFixed(1)}% accuracy, making it the most reliable for predictions.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">📊 Consistent Performance</h3>
                  <p className="text-sm text-gray-700">
                    All models maintain above {Math.min(...evaluationResults.model_results.map(m => m.accuracy)).toFixed(1)}% accuracy, showing robust performance across different prediction tasks.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Areas for Improvement</h3>
                  <p className="text-sm text-gray-700">
                    {evaluationResults.model_results.reduce((worst, model) => 
                      model.accuracy < worst.accuracy ? model : worst
                    ).name} could benefit from additional feature engineering to improve metrics.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Run evaluation to see detailed insights.</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Benchmark Comparison</h2>
            
            {evaluationResults ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Our Models</span>
                  <span className="font-bold text-green-600">{evaluationResults.benchmark_comparison.our_models.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Industry Average</span>
                  <span className="font-bold text-yellow-600">{evaluationResults.benchmark_comparison.industry_average.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Baseline Model</span>
                  <span className="font-bold text-red-600">{evaluationResults.benchmark_comparison.baseline_model.toFixed(1)}%</span>
                </div>
                
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">🏆 Achievement</h3>
                  <p className="text-sm text-gray-700">
                    Our models outperform industry average by {evaluationResults.benchmark_comparison.improvement_over_industry.toFixed(1)}% and baseline by {evaluationResults.benchmark_comparison.improvement_over_baseline.toFixed(1)}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Run evaluation to see benchmark comparison.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Dataset Information */}
        {evaluationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
              Dataset Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{evaluationResults.dataset_info.total_training_samples.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Training Samples</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{evaluationResults.dataset_info.total_test_samples.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Test Samples</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{evaluationResults.dataset_info.cross_validation_folds}</div>
                <div className="text-sm text-gray-600">CV Folds</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{evaluationResults.dataset_info.feature_count}</div>
                <div className="text-sm text-gray-600">Features</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Evaluation;
