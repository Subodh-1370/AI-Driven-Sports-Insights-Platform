import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BoltIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

const MomentumEngine = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentMatch, setCurrentMatch] = useState({
    team1: 'Team A',
    team2: 'Team B',
    score: { team1: 145, team2: 120 },
    overs: 18.3,
    momentum: { team1: 65, team2: 35 }
  });

  const momentumHistory = [
    { over: 1, team1: 50, team2: 50 },
    { over: 5, team1: 60, team2: 40 },
    { over: 10, team1: 55, team2: 45 },
    { over: 15, team1: 70, team2: 30 },
    { over: 18.3, team1: 65, team2: 35 }
  ];

  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const getMomentumColor = (value) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMomentumBarColor = (value) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
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
                <h1 className="text-2xl font-bold text-gray-800">Momentum Engine</h1>
                <p className="text-sm text-gray-500">Real-time game momentum tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">{isTracking ? 'Tracking' : 'Paused'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match Control */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Match Control</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team 1</label>
                  <input
                    type="text"
                    value={currentMatch.team1}
                    onChange={(e) => setCurrentMatch(prev => ({ ...prev, team1: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team 2</label>
                  <input
                    type="text"
                    value={currentMatch.team2}
                    onChange={(e) => setCurrentMatch(prev => ({ ...prev, team2: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <button
                  onClick={handleToggleTracking}
                  className={`w-full px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 ${
                    isTracking
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isTracking ? (
                    <>
                      <PauseIcon className="w-4 h-4" />
                      <span>Pause Tracking</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4" />
                      <span>Start Tracking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Momentum Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Live Momentum</h2>
              
              <div className="space-y-6">
                {/* Current Momentum */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">{currentMatch.team1}</h3>
                    <div className={`text-3xl font-bold ${getMomentumColor(currentMatch.momentum.team1)}`}>
                      {currentMatch.momentum.team1}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${getMomentumBarColor(currentMatch.momentum.team1)}`}
                        style={{ width: `${currentMatch.momentum.team1}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">{currentMatch.team2}</h3>
                    <div className={`text-3xl font-bold ${getMomentumColor(currentMatch.momentum.team2)}`}>
                      {currentMatch.momentum.team2}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${getMomentumBarColor(currentMatch.momentum.team2)}`}
                        style={{ width: `${currentMatch.momentum.team2}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Match Status */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Match Status</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Overs:</span>
                      <span className="font-bold text-blue-800 ml-2">{currentMatch.overs}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{currentMatch.team1}:</span>
                      <span className="font-bold text-blue-800 ml-2">{currentMatch.score.team1}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{currentMatch.team2}:</span>
                      <span className="font-bold text-blue-800 ml-2">{currentMatch.score.team2}</span>
                    </div>
                  </div>
                </div>

                {/* Momentum Indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 text-sm mb-1">Positive Factors</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Recent boundaries</li>
                      <li>• Partnership building</li>
                      <li>• Pressure on opponent</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 text-sm mb-1">Risk Factors</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Wickets falling</li>
                      <li>• Dot balls</li>
                      <li>• Field pressure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Momentum History */}
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Momentum History</h2>
            
            <div className="space-y-3">
              {momentumHistory.map((point, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    Over {point.over}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div
                          className="absolute top-0 left-0 h-4 bg-blue-500 rounded-l-full"
                          style={{ width: `${point.team1}%` }}
                        />
                        <div
                          className="absolute top-0 right-0 h-4 bg-red-500 rounded-r-full"
                          style={{ width: `${point.team2}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-medium text-blue-600">{point.team1}%</span>
                    <span className="text-gray-400 mx-1">-</span>
                    <span className="text-sm font-medium text-red-600">{point.team2}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MomentumEngine;
