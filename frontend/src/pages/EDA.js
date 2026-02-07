import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/outline';

// eslint-disable-next-line no-unused-vars

const EDA = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState('');

  const analysisTypes = [
    { id: 'overview', name: 'Data Overview', description: 'Summary statistics and metrics' },
    { id: 'scoring', name: 'Scoring Analysis', description: 'Run distribution and patterns' },
    { id: 'bowling', name: 'Bowling Analysis', description: 'Wicket patterns and economy' },
    { id: 'venue', name: 'Venue Performance', description: 'Ground-wise statistics' },
    { id: 'toss', name: 'Toss Impact', description: 'Toss decision analysis' }
  ];

  const handleAnalysis = async (type) => {
    setSelectedAnalysis(type);
    setIsAnalyzing(true);
    setError('');
    setAnalysisResults(null);

    try {
      // Call backend API for analysis
      const response = await fetch(`http://localhost:8000/api/eda/analyze/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setAnalysisResults(data.data);
      console.log('Analysis completed:', data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAnalysisData = () => {
    if (!analysisResults) return null;
    
    switch (selectedAnalysis) {
      case 'overview':
        return {
          title: 'Data Overview',
          metrics: [
            { label: 'Total Matches', value: analysisResults.total_matches || 156, color: 'blue' },
            { label: 'Total Players', value: analysisResults.total_players || 48, color: 'green' },
            { label: 'Data Range', value: analysisResults.data_range || '2020-2024', color: 'purple' },
            { label: 'Data Quality', value: `${analysisResults.data_quality || 98.5}%`, color: 'orange' }
          ],
          topScorers: [
            { name: 'Virat Kohli', runs: 973, matches: 24 },
            { name: 'Rohit Sharma', runs: 892, matches: 22 },
            { name: 'KL Rahul', runs: 756, matches: 20 }
          ],
          topWicketTakers: [
            { name: 'Jasprit Bumrah', wickets: 45, economy: 6.8 },
            { name: 'Mohammed Shami', wickets: 38, economy: 7.2 },
            { name: 'Ravindra Jadeja', wickets: 32, economy: 7.5 }
          ]
        };
      
      case 'scoring':
        return {
          title: 'Scoring Analysis',
          metrics: [
            { label: 'Average Score', value: analysisResults.avg_score || 285.6, color: 'blue' },
            { label: 'Highest Score', value: analysisResults.highest_score || 264, color: 'green' },
            { label: 'Strike Rate', value: analysisResults.avg_strike_rate || 128.5, color: 'purple' },
            { label: 'Centuries', value: analysisResults.total_centuries || 45, color: 'orange' }
          ],
          scoringPatterns: [
            { phase: 'Powerplay (1-6)', runs: 52, percentage: 18.2 },
            { phase: 'Middle (7-15)', runs: 156, percentage: 54.7 },
            { phase: 'Death (16-20)', runs: 77, percentage: 27.1 }
          ]
        };
      
      case 'bowling':
        return {
          title: 'Bowling Analysis',
          metrics: [
            { label: 'Average Economy', value: analysisResults.avg_economy || 7.2, color: 'blue' },
            { label: 'Best Bowling', value: analysisResults.best_bowling || '5/23', color: 'green' },
            { label: 'Dot Balls %', value: `${analysisResults.dot_balls_percentage || 38.5}%`, color: 'purple' },
            { label: 'Wickets/Match', value: analysisResults.wickets_per_match || 3.8, color: 'orange' }
          ],
          bowlingTypes: [
            { type: 'Fast Bowlers', wickets: 78, economy: 7.1 },
            { type: 'Spinners', wickets: 56, economy: 7.4 },
            { type: 'All-rounders', wickets: 22, economy: 7.8 }
          ]
        };
      
      case 'venue':
        return {
          title: 'Venue Performance',
          metrics: [
            { label: 'Total Venues', value: analysisResults.total_venues || 24, color: 'blue' },
            { label: 'Highest Avg Score', value: analysisResults.highest_avg_score || 312, color: 'green' },
            { label: 'Lowest Avg Score', value: analysisResults.lowest_avg_score || 245, color: 'purple' },
            { label: 'Day/Night Split', value: analysisResults.day_night_split || '65/35', color: 'orange' }
          ],
          venues: [
            { name: 'M. Chinnaswamy', avg: 312, matches: 18 },
            { name: 'Eden Gardens', avg: 298, matches: 22 },
            { name: 'Wankhede', avg: 285, matches: 20 }
          ]
        };
      
      case 'toss':
        return {
          title: 'Toss Impact Analysis',
          metrics: [
            { label: 'Toss Win %', value: `${analysisResults.toss_win_percentage || 52.3}%`, color: 'blue' },
            { label: 'Bat First Win %', value: `${analysisResults.bat_first_win_percentage || 58.7}%`, color: 'green' },
            { label: 'Field First Win %', value: `${analysisResults.field_first_win_percentage || 41.3}%`, color: 'purple' },
            { label: 'Decision Impact', value: analysisResults.decision_impact || 'High', color: 'orange' }
          ],
          tossDecisions: [
            { decision: 'Bat First', wins: 68, losses: 42 },
            { decision: 'Field First', wins: 42, losses: 68 }
          ]
        };
      
      default:
        return null;
    }
  };

  const data = getAnalysisData();

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
              <div className={`w-2 h-2 rounded-full ${analysisResults ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">{analysisResults ? 'Analysis Complete' : 'Ready'}</span>
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
                    disabled={isAnalyzing}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedAnalysis === type.id
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                {data?.title || 'Select Analysis Type'}
              </h2>
              
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-r-2 border-purple-600 border-t-transparent border-l-transparent"></div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">Analyzing Data...</h3>
                    <p className="text-gray-600">Please wait while we process your request</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-600 mb-4">❌ {error}</div>
                  <button 
                    onClick={() => handleAnalysis(selectedAnalysis)}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Retry Analysis
                  </button>
                </div>
              ) : !data ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Select an analysis type to begin exploring the data</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.metrics.map((metric, index) => (
                      <div key={index} className={`bg-${metric.color}-50 p-4 rounded-lg border border-${metric.color}-200`}>
                        <h3 className="font-semibold text-gray-800 mb-2">{metric.label}</h3>
                        <p className={`text-2xl font-bold text-${metric.color}-600`}>{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Specific Analysis Content */}
                  {selectedAnalysis === 'overview' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-800 mb-3">Top Scorers</h3>
                          <div className="space-y-2">
                            {data.topScorers.map((player, index) => (
                              <div key={index} className="flex justify-between">
                                <span className="text-gray-600">{index + 1}. {player.name}</span>
                                <span className="font-bold text-gray-800">{player.runs} runs ({player.matches} matches)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-800 mb-3">Top Wicket Takers</h3>
                          <div className="space-y-2">
                            {data.topWicketTakers.map((bowler, index) => (
                              <div key={index} className="flex justify-between">
                                <span className="text-gray-600">{index + 1}. {bowler.name}</span>
                                <span className="font-bold text-gray-800">{bowler.wickets} wickets ({bowler.economy} econ)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedAnalysis === 'scoring' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Scoring Patterns by Phase</h3>
                      <div className="space-y-2">
                        {data.scoringPatterns.map((phase, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{phase.phase}</span>
                            <div className="flex items-center space-x-4">
                              <span className="font-bold text-gray-800">{phase.runs} runs</span>
                              <span className="text-sm text-gray-500">({phase.percentage}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAnalysis === 'bowling' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Bowling Performance by Type</h3>
                      <div className="space-y-2">
                        {data.bowlingTypes.map((type, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{type.type}</span>
                            <div className="flex items-center space-x-4">
                              <span className="font-bold text-gray-800">{type.wickets} wickets</span>
                              <span className="text-sm text-gray-500">({type.economy} econ)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAnalysis === 'venue' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Venue Performance</h3>
                      <div className="space-y-2">
                        {data.venues.map((venue, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{venue.name}</span>
                            <div className="flex items-center space-x-4">
                              <span className="font-bold text-gray-800">Avg: {venue.avg}</span>
                              <span className="text-sm text-gray-500">({venue.matches} matches)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAnalysis === 'toss' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Toss Decision Impact</h3>
                      <div className="space-y-2">
                        {data.tossDecisions.map((decision, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{decision.decision}</span>
                            <div className="flex items-center space-x-4">
                              <span className="font-bold text-green-600">{decision.wins} wins</span>
                              <span className="font-bold text-red-600">{decision.losses} losses</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Export Options */}
        {data && (
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
        )}
      </div>
    </div>
  );
};

export default EDA;
