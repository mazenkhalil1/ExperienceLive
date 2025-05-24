import React from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

function ProfilePage() {
  const { user, isLoading, logout } = useUser();
  const { isDarkMode } = useTheme();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* Optional: Add a loader component here */}
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Redirect or show a message if user is not authenticated (should be handled by ProtectedRoute, but good practice)
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-400">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-w-md mx-auto text-gray-800 dark:text-white transition-colors duration-200`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Placeholder for profile picture */}
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-1 font-serif">{user.name}</h1>
          {user.createdAt && (
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">Member Since {new Date(user.createdAt).toLocaleDateString()}</p>
          )}
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">Role: {user.role}</p>
        </div>
      </div>
      
      {/* Optional: Add more profile details here */}

      <div className="mt-6 text-center sm:text-left">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </motion.div>
  );
}

export default ProfilePage; 