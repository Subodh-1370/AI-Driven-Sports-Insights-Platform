import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SunIcon, 
  MoonIcon, 
  ArrowLeftIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Check current path for back button
    const path = window.location.pathname;
    setCurrentPath(path);
    setShowBackButton(path !== '/' && path !== '/dashboard');
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleBack = () => {
    if (currentPath !== '/') {
      window.history.back();
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleHome = () => {
    window.location.href = '/dashboard';
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 backdrop-blur-md shadow-md border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Left Section - Back Button + Logo */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Go Back"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </motion.button>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={handleHome}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-lg font-bold">🏏</span>
              </div>

              <div>
                <h1 className={`text-lg font-bold transition-colors ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  AI Cricket Analytics
                </h1>
                <p className={`text-xs transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Data Intelligence Platform
                </p>
              </div>
            </motion.div>
          </div>

          
          <div className="flex items-center space-x-6">
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleHome}
                className={`transition font-medium flex items-center space-x-1 ${
                  isDark 
                    ? 'text-gray-300 hover:text-blue-400' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`transition font-medium ${
                  isDark 
                    ? 'text-gray-300 hover:text-blue-400' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
              </motion.button>
            </nav>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </motion.button>
          </div>

        </div>
      </div>
    </motion.header>
  );
};

export default Header;
