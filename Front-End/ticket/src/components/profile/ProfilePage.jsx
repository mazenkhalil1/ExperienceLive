import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../shared/Loader';
import { showToast } from '../shared/Toast';
import UpdateProfileForm from './UpdateProfileForm';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axiosConfig';

const ProfilePage = () => {
  const { user, loading, error } = useUser();
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    setIsLoadingDetails(true);
    try {
      // Fetch bookings
      const bookingsResponse = await axiosInstance.get('/bookings/user');
      if (bookingsResponse.data.success) {
        setBookings(bookingsResponse.data.data);
      }

      // Fetch events if user is an organizer
      if (user.role === 'organizer') {
        const eventsResponse = await axiosInstance.get('/events/organizer');
        if (eventsResponse.data.success) {
          setEvents(eventsResponse.data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      showToast.error('Failed to load some profile details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Format date of birth if it exists
  const formattedBirthdate = user?.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'N/A';

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
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">Member Since {new Date(user.createdAt).getFullYear()}</p>
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
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-1 9l-4.343-4.343m0 0L9.657 17.657m0 0l-4.343 4.343m0 0A9 9 0 1020 11a9 9 0 00-11.468 5.16m0 0L7 19m4 4v-4m-3 0H9m10 0h2"></path>
                </svg>
                <span>{user.email || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span>MFA Status: {user.mfaEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span className="capitalize">{user.role || 'N/A'}</span>
              </div>
            </div>

            {/* Bookings Section */}
            {bookings.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Bookings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookings.map(booking => (
                    <div key={booking._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 dark:text-white">{booking.event?.title || 'Event'}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Date: {new Date(booking.event?.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Tickets: {booking.ticketCount}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Total: ${booking.totalPrice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Section (for organizers) */}
            {user.role === 'organizer' && events.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map(event => (
                    <div key={event._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 dark:text-white">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Date: {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Location: {event.location}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Status: <span className={`capitalize ${event.status === 'approved' ? 'text-green-600' : event.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                          {event.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isLoadingDetails && (
              <div className="flex justify-center items-center py-4">
                <Loader type="spinner" size="small" text="Loading additional details..." />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage; 