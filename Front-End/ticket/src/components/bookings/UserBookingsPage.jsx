import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/users/bookings');
      // The backend returns the bookings array directly
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    // Add confirmation prompt if desired
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // Optimistically update UI
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId ? { ...booking, status: 'cancelling' } : booking
        ));
        
        await axiosInstance.delete(`/bookings/${bookingId}`);
        showToast.success('Booking cancelled successfully');
        // Refresh bookings list to get the updated status from backend
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        showToast.error(error.response?.data?.message || 'Failed to cancel booking');
        // Revert optimistic update if cancellation failed
        fetchBookings();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen-except-nav-footer flex items-center justify-center">
        <Loader type="spinner" size="large" text="Loading bookings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 text-center min-h-screen-except-nav-footer"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Bookings</h2>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-600 dark:text-gray-400">
          You haven't made any bookings yet.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Bookings</h1>
      <div className="space-y-6">
        <AnimatePresence>
          {bookings.map((booking) => (
            <motion.div
              key={booking._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
            >
              {/* Booking Details */}
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {booking.event?.title || 'Event Title Not Available'}
                </h3>
                {booking.event?.date && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>Date: {new Date(booking.event.date).toLocaleDateString()}</span>
                  </div>
                )}
                {booking.event?.location && (
                   <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <span>Location: {booking.event.location}</span>
                   </div>
                )}
                 <div className="flex items-center text-gray-600 dark:text-gray-300">
                     <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                   <span>Quantity: {booking.quantity} tickets</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                   <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   <span>Total Price: <span className="font-semibold">${booking.totalPrice?.toFixed(2) || 'N/A'}</span></span>
                </div>
                 <div className="flex items-center text-gray-600 dark:text-gray-300">
                     <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                     </svg>
                   Status: <span className={`font-medium ${booking.status === 'active' ? 'text-green-600 dark:text-green-400' : booking.status === 'cancelled' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>{booking.status}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center space-y-2">
                  {booking.status === 'active' && (
                      <motion.button
                        onClick={() => handleCancelBooking(booking._id)}
                        className={
                           `px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 shadow-md`
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={booking.status === 'cancelling'}
                      >
                         {booking.status === 'cancelling' ? (
                            <div className="flex items-center">
                               <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path></svg>
                               Cancelling...
                            </div>
                         ) : (
                            'Cancel Booking'
                         )}
                      </motion.button>
                  )}
                  {/* Add a link/button to view booking details if applicable */}
                   {/* <button className="text-blue-600 dark:text-blue-400 hover:underline">View Details</button> */}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default UserBookingsPage; 