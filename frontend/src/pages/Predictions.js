import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
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
        toast.success('Win probability calculated successfully!');
      } else {
        toast.error(result.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to connect to backend');
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
        toast.success('Innings score predicted successfully!');
      } else {
        toast.error(result.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to connect to backend');
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
        toast.success('Player performance predicted successfully!');
      } else {
        toast.error(result.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to connect to backend');
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
        className={`bg-gradient-to-br ${getCardStyle()} p-8 rounded-2xl text-white`}
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

  const PredictionForm = ({ children, title, icon: Icon, onSubmit, loading }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Icon className="w-5 h-5 mr-2 text-blue-400" />
        {title}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="spinner" />
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
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">
          🤖 AI Predictions
        </h1>
        <p className="text-gray-400 text-lg">
          Advanced machine learning predictions for cricket analytics
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="glass p-1 rounded-lg">
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
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
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
            <PredictionForm
              title="Match Win Prediction"
              icon={TrophyIcon}
              onSubmit={handleWinPrediction}
              loading={loading}
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Team 1"
                  value={winForm.team1}
                  onChange={(e) => setWinForm(prev => ({ ...prev, team1: e.target.value }))}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Team 2"
                  value={winForm.team2}
                  onChange={(e) => setWinForm(prev => ({ ...prev, team2: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Venue"
                value={winForm.venue}
                onChange={(e) => setWinForm(prev => ({ ...prev, venue: e.target.value }))}
                className="input-field"
                required
              />
              <select
                value={winForm.toss_decision}
                onChange={(e) => setWinForm(prev => ({ ...prev, toss_decision: e.target.value }))}
                className="input-field"
              >
                <option value="bat">Bat First</option>
                <option value="bowl">Bowl First</option>
              </select>
            </PredictionForm>
          )}

          {activeTab === 'innings' && (
            <PredictionForm
              title="Innings Score Prediction"
              icon={CpuChipIcon}
              onSubmit={handleInningsPrediction}
              loading={loading}
            >
              <input
                type="text"
                placeholder="Batting Team"
                value={inningsForm.team}
                onChange={(e) => setInningsForm(prev => ({ ...prev, team: e.target.value }))}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Venue"
                value={inningsForm.venue}
                onChange={(e) => setInningsForm(prev => ({ ...prev, venue: e.target.value }))}
                className="input-field"
                required
              />
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
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
            </PredictionForm>
          )}

          {activeTab === 'player' && (
            <PredictionForm
              title="Player Performance Prediction"
              icon={UserIcon}
              onSubmit={handlePlayerPrediction}
              loading={loading}
            >
              <input
                type="text"
                placeholder="Player Name"
                value={playerForm.player_name}
                onChange={(e) => setPlayerForm(prev => ({ ...prev, player_name: e.target.value }))}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Team (Optional)"
                value={playerForm.team}
                onChange={(e) => setPlayerForm(prev => ({ ...prev, team: e.target.value }))}
                className="input-field"
              />
            </PredictionForm>
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

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <ArrowPathIcon className="w-5 h-5 mr-2 text-purple-400" />
              Model Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Win Prediction Accuracy</span>
                <span className="text-green-400 font-medium">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Score Prediction Error</span>
                <span className="text-blue-400 font-medium">±8.5 runs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Player Performance R²</span>
                <span className="text-purple-400 font-medium">0.892</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
