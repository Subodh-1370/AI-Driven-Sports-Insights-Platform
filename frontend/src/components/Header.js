import React from 'react';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🏏</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Cricket Analytics</h1>
              <p className="text-xs text-gray-500">Complete Data Pipeline</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Analytics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Predictions
            </motion.button>
          </nav>

          {/* System Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
              <HomeIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Ready</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex justify-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Analytics
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Predictions
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
