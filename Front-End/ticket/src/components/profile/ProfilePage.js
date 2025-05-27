import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../shared/Loader';
import { showToast } from '../shared/Toast';
import UpdateProfileForm from './UpdateProfileForm';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, loading, error } = useUser();
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  // Format date of birth if it exists
  const formattedBirthdate = user?.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'N/A';

  // Add this function to calculate days since user joined
  const calculateMembershipDuration = (createdAtDate) => {
    if (!createdAtDate) return "N/A";
    
    try {
      const joinDate = new Date(createdAtDate);
      const today = new Date();
      
      // Calculate difference in milliseconds
      const diffTime = Math.abs(today - joinDate);
      // Convert to days
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day";
      return `${diffDays} days`;
    } catch (error) {
      console.error('Error calculating membership duration:', error);
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen-except-nav-footer pt-16 px-4">
        <Loader type="spinner" size="large" text="Loading profile..." />
      </div>
    );
  }

  if (error) {
    showToast.error(error);
    return (
      <div className="flex justify-center items-center min-h-screen-except-nav-footer pt-16 px-4">
        <div className="text-red-500 dark:text-red-400 text-center">
          Error loading profile. Please try again later.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen-except-nav-footer pt-16 px-4">
        <div className="text-center text-gray-600 dark:text-gray-400">
          No profile data available
        </div>
      </div>
    );
  }

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    showToast.success('Profile updated successfully!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center py-8 px-4"
    >
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 space-y-8">

        {/* Profile Info Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
          {/* Profile Picture Placeholder/Image */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture}
                alt={`${user.name}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-20 h-20 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            )}
          </div>

          {/* Name, Member Since, Edit Button */}
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-1 font-serif">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
              Member Since {calculateMembershipDuration(user.createdAt)}
            </p>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <UpdateProfileForm onUpdateSuccess={handleUpdateSuccess} />
        ) : (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2, duration: 0.5 }}
             className="space-y-6"
          >
             {/* Contact Information */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* <div className="flex items-center text-gray-700 dark:text-gray-300">
                     <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 10a4 4 0 01-1.382 3.09l-3.62 3.62a1 1 0 001.414 1.414l3.62-3.62A6 6 0 0021 12h-4a2 2 0 00-2 2v1z"></path></svg>
                     <span>{user.phone || 'N/A'}</span>
                 </div>
                 <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>{formattedBirthdate}</span>
                 </div> */}
                 <div className="flex items-center text-gray-700 dark:text-gray-300">
                     <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 0a5 5 0 11-7.072 0m7.072 0L5.636 18.364m0 0a5 5 0 110-7.072m0 7.072L18.364 5.636m0 0a5 5 0 107.072 7.072M18.364 5.636A5 5 0 1011.292 12.708M12.708 11.292a5 5 0 10-7.072 7.072M18.364 5.636L5.636 18.364"></path>
                     </svg>
                    <span className="capitalize">{user.role || 'N/A'}</span>
                 </div>
                 {user.location && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                       <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                       <span>{user.location || 'N/A'}</span>
                    </div>
                  )}
                 <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-1 9l-4.343-4.343m0 0L9.657 17.657m0 0l-4.343 4.343m0 0A9 9 0 1020 11a9 9 0 00-11.468 5.16m0 0L7 19m4 4v-4m-3 0H9m10 0h2"></path></svg>
                    <span>{user.email || 'N/A'}</span>
                 </div>
              </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;