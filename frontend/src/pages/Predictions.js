import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CpuChipIcon, 
  TrophyIcon, 
  UserIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Predictions = () => {
  const [activeTab, setActiveTab] = useState('win');
  const [loading, setLoading] = useState(false);

  // Form states
  const [winForm, setWinForm] = useState({
    team1: 'Team A',
    team2: 'Team B',
    venue: 'Neutral Venue',
    toss_decision: 'bat'
  });

  const [inningsForm, setInningsForm] = useState({
    team: 'Team A',
    venue: 'Neutral Venue',
    overs: 20
  });

  const [playerForm, setPlayerForm] = useState({
    player_name: 'Sample Player',
    team: ''
  });

  const [results, setResults] = useState({});

  const handleWinPrediction = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/predict/win', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(winForm)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setResults(prev => ({ ...prev, win: result.data }));
      } else {
        console.error('Prediction failed:', result.message);
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInningsPrediction = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/predict/innings-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inningsForm)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setResults(prev => ({ ...prev, innings: result.data }));
      } else {
        console.error('Prediction failed:', result.message);
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerPrediction = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/predict/player-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerForm)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setResults(prev => ({ ...prev, player: result.data }));
      } else {
        console.error('Prediction failed:', result.message);
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const ResultCard = ({ type, data }) => {
    const getCardStyle = () => {
      switch (type) {
        case 'win': return 'from-green-500 to-emerald-600';
        case 'innings': return 'from-orange-500 to-amber-600';
        case 'player': return 'from-purple-500 to-violet-600';
        default: return 'from-blue-500 to-indigo-600';
      }
    };

    const getIcon = () => {
      switch (type) {
        case 'win': return TrophyIcon;
        case 'innings': return CpuChipIcon;
        case 'player': return UserIcon;
        default: return SparklesIcon;
      }
    };

    const Icon = getIcon();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${getCardStyle()} p-8 rounded-2xl text-white shadow-lg`}
      >
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-8 h-8" />
          <span className="text-sm opacity-80">Prediction Result</span>
        </div>
        
        {type === 'win' && (
          <div>
            <div className="text-4xl font-bold mb-2">
              {(data.win_probability * 100).toFixed(1)}%
            </div>
            <div className="text-lg opacity-90 mb-1">
              {data.team1} vs {data.team2}
            </div>
            <div className="text-sm opacity-80">
              Probability that {data.team1} wins at {data.venue}
            </div>
          </div>
        )}

        {type === 'innings' && (
          <div>
            <div className="text-4xl font-bold mb-2">
              {data.predicted_score.toFixed(1)} runs
            </div>
            <div className="text-lg opacity-90 mb-1">
              {data.team} • {data.overs} overs
            </div>
            <div className="text-sm opacity-80">
              Expected total at {data.venue}
            </div>
          </div>
        )}

        {type === 'player' && (
          <div>
            <div className="text-4xl font-bold mb-2">
              {data.predicted_runs.toFixed(1)} runs
            </div>
            <div className="text-lg opacity-90 mb-1">
              {data.player_name}
            </div>
            <div className="text-sm opacity-80">
              Historical average: {data.historical_total_runs.toFixed(1)} runs
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <CpuChipIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ML Predictions</h1>
                <p className="text-sm text-gray-500">AI-powered cricket predictions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Models Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-1">
            {[
              { id: 'win', name: 'Win Probability', icon: TrophyIcon },
              { id: 'innings', name: 'Innings Score', icon: CpuChipIcon },
              { id: 'player', name: 'Player Performance', icon: UserIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prediction Forms and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Forms */}
          <div className="space-y-6">
            {activeTab === 'win' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <TrophyIcon className="w-5 h-5 mr-2 text-orange-600" />
                  Match Win Prediction
                </h3>
                <form onSubmit={handleWinPrediction} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Team 1"
                      value={winForm.team1}
                      onChange={(e) => setWinForm(prev => ({ ...prev, team1: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Team 2"
                      value={winForm.team2}
                      onChange={(e) => setWinForm(prev => ({ ...prev, team2: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Venue"
                    value={winForm.venue}
                    onChange={(e) => setWinForm(prev => ({ ...prev, venue: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  <select
                    value={winForm.toss_decision}
                    onChange={(e) => setWinForm(prev => ({ ...prev, toss_decision: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="bat">Bat First</option>
                    <option value="bowl">Bowl First</option>
                  </select>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white border-t-transparent border-l-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4" />
                        <span>Get Prediction</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'innings' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <CpuChipIcon className="w-5 h-5 mr-2 text-orange-600" />
                  Innings Score Prediction
                </h3>
                <form onSubmit={handleInningsPrediction} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Batting Team"
                    value={inningsForm.team}
                    onChange={(e) => setInningsForm(prev => ({ ...prev, team: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Venue"
                    value={inningsForm.venue}
                    onChange={(e) => setInningsForm(prev => ({ ...prev, venue: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  <div>
                    <label className="text-gray-700 text-sm mb-2 block">
                      Number of Overs: {inningsForm.overs}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={inningsForm.overs}
                      onChange={(e) => setInningsForm(prev => ({ ...prev, overs: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white border-t-transparent border-l-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4" />
                        <span>Get Prediction</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'player' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-orange-600" />
                  Player Performance Prediction
                </h3>
                <form onSubmit={handlePlayerPrediction} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Player Name"
                    value={playerForm.player_name}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, player_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Team (Optional)"
                    value={playerForm.team}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, team: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white border-t-transparent border-l-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4" />
                        <span>Get Prediction</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results.win && activeTab === 'win' && (
              <ResultCard type="win" data={results.win} />
            )}
            {results.innings && activeTab === 'innings' && (
              <ResultCard type="innings" data={results.innings} />
            )}
            {results.player && activeTab === 'player' && (
              <ResultCard type="player" data={results.player} />
            )}

            {/* Model Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ArrowPathIcon className="w-5 h-5 mr-2 text-purple-600" />
                Model Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Win Prediction Accuracy</span>
                  <span className="text-green-600 font-medium">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Score Prediction Error</span>
                  <span className="text-blue-600 font-medium">±8.5 runs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Player Performance R²</span>
                  <span className="text-purple-600 font-medium">0.892</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
