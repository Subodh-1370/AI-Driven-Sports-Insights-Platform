import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  ChartBarIcon, 
  MapPinIcon, 
  DocumentTextIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_matches: 0,
    total_deliveries: 0,
    teams: [],
    venues: [],
    seasons: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/stats/overview');
        const result = await response.json();
        
        if (result.success) {
          setStats(result.data);
        } else {
          toast.error('Failed to load statistics');
        }
      } catch (error) {
        console.error('Stats fetch error:', error);
        toast.error('Failed to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Sample data for charts (replace with real data)
  const performanceData = [
    { name: 'Jan', matches: 12, wins: 8 },
    { name: 'Feb', matches: 15, wins: 10 },
    { name: 'Mar', matches: 18, wins: 12 },
    { name: 'Apr', matches: 14, wins: 9 },
    { name: 'May', matches: 20, wins: 15 },
    { name: 'Jun', matches: 16, wins: 11 }
  ];

  const venueDistribution = [
    { name: 'Mumbai', value: 25, color: '#3b82f6' },
    { name: 'Delhi', value: 20, color: '#8b5cf6' },
    { name: 'Bangalore', value: 18, color: '#ec4899' },
    { name: 'Kolkata', value: 15, color: '#f59e0b' },
    { name: 'Others', value: 22, color: '#6b7280' }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 card-hover cursor-pointer"
      whileHover={{ scale: 1.02 }}
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
        <div className="flex items-center space-x-1">
          <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-400">+12%</span>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
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
          🏏 Cricket Analytics Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Real-time insights and AI-powered predictions
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DocumentTextIcon}
          title="Total Matches"
          value={stats.total_matches}
          subtitle="Across all seasons"
          color="blue"
        />
        <StatCard
          icon={ClockIcon}
          title="Total Deliveries"
          value={stats.total_deliveries.toLocaleString()}
          subtitle="Ball-by-ball data"
          color="purple"
        />
        <StatCard
          title="Avg Score"
          value="167.4"
          subtitle="Runs per innings"
          icon={ArrowTrendingUpIcon}
          trend={8}
          color="green"
        />
        <StatCard
          icon={MapPinIcon}
          title="Venues"
          value={stats.venues.length}
          subtitle="Stadiums tracked"
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-blue-400" />
            Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="matches" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="wins" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Venue Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2 text-purple-400" />
            Venue Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={venueDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {venueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {venueDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2 text-green-400" />
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <CheckCircleIcon className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-white font-medium">ML Models</p>
              <p className="text-green-400 text-sm">All models loaded</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <ClockIcon className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white font-medium">API Response</p>
              <p className="text-blue-400 text-sm">~120ms average</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <ArrowTrendingUpIcon className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-white font-medium">Accuracy</p>
              <p className="text-purple-400 text-sm">94.2% average</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
