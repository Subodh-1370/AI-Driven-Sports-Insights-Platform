import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  UsersIcon,
  MapPinIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { 
  AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    team: 'all',
    venue: 'all',
    season: 'all'
  });

  useEffect(() => {
    // Simulate data loading - replace with actual API call
    setTimeout(() => {
      setData([
        { date: '2024-01-01', runs: 156, wickets: 6, overs: 20 },
        { date: '2024-01-02', runs: 189, wickets: 8, overs: 20 },
        { date: '2024-01-03', runs: 145, wickets: 5, overs: 18.5 },
        { date: '2024-01-04', runs: 201, wickets: 9, overs: 20 },
        { date: '2024-01-05', runs: 178, wickets: 7, overs: 20 },
        { date: '2024-01-06', runs: 167, wickets: 6, overs: 19.4 },
        { date: '2024-01-07', runs: 194, wickets: 8, overs: 20 },
        { date: '2024-01-08', runs: 182, wickets: 7, overs: 20 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const teamPerformance = [
    { team: 'India', runs: 2450, wickets: 98, matches: 12 },
    { team: 'Australia', runs: 2380, wickets: 102, matches: 12 },
    { team: 'England', runs: 2290, wickets: 95, matches: 12 },
    { team: 'Pakistan', runs: 2180, wickets: 108, matches: 12 },
    { team: 'South Africa', runs: 2120, wickets: 92, matches: 12 }
  ];

  const venueStats = [
    { venue: 'Mumbai', avgRuns: 178, avgWickets: 6.8, matches: 15 },
    { venue: 'Delhi', avgRuns: 165, avgWickets: 7.2, matches: 12 },
    { venue: 'Bangalore', avgRuns: 185, avgWickets: 6.5, matches: 10 },
    { venue: 'Kolkata', avgRuns: 172, avgWickets: 7.0, matches: 8 }
  ];

  const radarData = [
    { stat: 'Batting', A: 85, B: 78, fullMark: 100 },
    { stat: 'Bowling', A: 78, B: 82, fullMark: 100 },
    { stat: 'Fielding', A: 90, B: 75, fullMark: 100 },
    { stat: 'Powerplay', A: 82, B: 88, fullMark: 100 },
    { stat: 'Death Overs', A: 75, B: 92, fullMark: 100 },
    { stat: 'Consistency', A: 88, B: 80, fullMark: 100 }
  ];

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg bg-gradient-to-br from-${color}-500 to-${color}-600`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${
            trend > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span className="text-xs font-medium">
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">
          📊 Advanced Analytics
        </h1>
        <p className="text-gray-400 text-lg">
          Deep insights into cricket performance and trends
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-4 mb-6"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <span className="text-white font-medium">Filters:</span>
          </div>
          <select
            value={filters.team}
            onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
            className="input-field text-sm"
          >
            <option value="all">All Teams</option>
            <option value="india">India</option>
            <option value="australia">Australia</option>
            <option value="england">England</option>
          </select>
          <select
            value={filters.venue}
            onChange={(e) => setFilters(prev => ({ ...prev, venue: e.target.value }))}
            className="input-field text-sm"
          >
            <option value="all">All Venues</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="bangalore">Bangalore</option>
          </select>
          <select
            value={filters.season}
            onChange={(e) => setFilters(prev => ({ ...prev, season: e.target.value }))}
            className="input-field text-sm"
          >
            <option value="all">All Seasons</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Matches"
          value="1,248"
          subtitle="This season"
          icon={ChartBarIcon}
          trend={12}
          color="blue"
        />
        <MetricCard
          title="Avg Score"
          value="167.4"
          subtitle="Runs per innings"
          icon={ArrowTrendingUpIcon}
          trend={8}
          color="green"
        />
        <MetricCard
          title="Teams Tracked"
          value="12"
          subtitle="Active teams"
          icon={UsersIcon}
          trend={0}
          color="purple"
        />
        <MetricCard
          title="Venues"
          value="24"
          subtitle="Stadiums analyzed"
          icon={MapPinIcon}
          trend={4}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-blue-400" />
            Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="runs" 
                stroke="#3b82f6" 
                fill="url(#colorRuns)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Team Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <UsersIcon className="w-5 h-5 mr-2 text-purple-400" />
            Team Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="team" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="runs" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venue Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2 text-orange-400" />
            Venue Analysis
          </h3>
          <div className="space-y-3">
            {venueStats.map((venue, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-white font-medium">{venue.venue}</p>
                  <p className="text-gray-400 text-sm">{venue.matches} matches</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-medium">{venue.avgRuns} runs</p>
                  <p className="text-green-400 text-sm">{venue.avgWickets} wkts</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-green-400" />
            Team Comparison Radar
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="stat" stroke="#9ca3af" />
              <PolarRadiusAxis stroke="#9ca3af" />
              <Radar name="Team A" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Radar name="Team B" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
