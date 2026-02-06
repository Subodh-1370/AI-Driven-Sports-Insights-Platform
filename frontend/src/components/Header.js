import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">🏏</span>
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-800">
                AI Cricket Analytics
              </h1>
              <p className="text-xs text-gray-500">
                Data Intelligence Platform
              </p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-gray-600 hover:text-blue-600 transition font-medium"
            >
              Dashboard
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-gray-600 hover:text-blue-600 transition font-medium"
            >
              Pipeline
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-gray-600 hover:text-blue-600 transition font-medium"
            >
              Documentation
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              Get Started
            </motion.button>

          </nav>

          {/* Status */}
          <div className="hidden md:flex items-center space-x-3 bg-green-50 px-3 py-1 rounded-full">
            <SparklesIcon className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              System Ready
            </span>
          </div>

        </div>
      </div>
    </motion.header>
  );
};

export default Header;
