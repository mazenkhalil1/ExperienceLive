import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const EventAnalytics = () => {
  const navigate = useNavigate();
  const { user, userRole } = useUser();
  const { isDarkMode } = useTheme();
  const [analytics, setAnalytics] = useState({
    bookingsByEvent: [],
    revenueByEvent: [],
    bookingsByDate: [],
    ticketTypeDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug current state
  useEffect(() => {
    console.log('EventAnalytics Mount State:', {
      userFromContext: user,
      roleFromContext: userRole,
      userFromStorage: JSON.parse(localStorage.getItem('user')),
      roleFromStorage: localStorage.getItem('userRole'),
      token: localStorage.getItem('token')
    });
  }, [user, userRole]);

  // Verify access on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedRole = localStorage.getItem('userRole');
    const effectiveRole = userRole || storedRole;
    
    console.log('Access Check:', {
      effectiveRole,
      userRole,
      storedRole,
      user,
      storedUser
    });

    if (!effectiveRole) {
      console.log('No role found, redirecting to login');
      navigate('/login');
      return;
    }

    if (effectiveRole !== 'organizer') {
      console.log('Non-organizer role found:', effectiveRole);
      navigate('/login');
    }
  }, [userRole, navigate, user]);

  const verifyAccess = useCallback(() => {
    const storedRole = localStorage.getItem('userRole');
    const effectiveRole = userRole || storedRole;
    
    console.log('Verify Access Check:', {
      effectiveRole,
      userRole,
      storedRole,
      hasUser: !!user,
      token: !!localStorage.getItem('token')
    });

    if (!user || !effectiveRole) {
      throw new Error('Authentication required');
    }
    
    if (effectiveRole !== 'organizer') {
      throw new Error('Unauthorized: Organizer access required');
    }
  }, [user, userRole]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Verify access before making the request
      verifyAccess();
      
      const res = await axiosInstance.get('/events/analytics');
      
      if (!res.data) {
        throw new Error('No data received from server');
      }

      if (!res.data.success) {
        throw new Error('Failed to fetch analytics data');
      }

      setAnalytics(res.data.data);
      setError(null);
    } catch (error) {
      if (!user || !userRole) {
        navigate('/login');
        return;
      }
      
      setError(error.response?.data?.message || error.message || 'Failed to load analytics data');
      showToast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [navigate, verifyAccess, user, userRole]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen-except-nav-footer pt-16 px-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen-except-nav-footer pt-16 px-4 transition-colors duration-200 flex justify-center`}
    >
      <div className="max-w-4xl w-full">
        <button
          onClick={() => navigate('/organizer/events')}
          className="mb-8 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200 focus:outline-none"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 px-6 py-5">
            <h1 className="text-2xl font-bold text-white">Event Analytics Dashboard</h1>
          </div>

          <div className="p-6">
            {/* Overall Summary Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-gray-50 dark:bg-gray-700 rounded-lg p-7 border border-gray-200 dark:border-gray-600 mb-8 shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Overall Booking Rate</h3>
              <p className="text-5xl font-extrabold text-purple-700 dark:text-purple-400">{analytics.bookingsByEvent.reduce((sum, event) => sum + event.bookings, 0) / analytics.bookingsByEvent.length}%</p>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-3">Average across all your events</p>
            </motion.div>

            {/* Per Event Analytics Section */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
            >
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Event Booking Details</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {analytics.bookingsByEvent.map((event, index) => (
                  <motion.div 
                     key={index} 
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.1 * index + 0.5, duration: 0.4 }}
                     className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{event.name}</h4>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm 
                          ${event.bookings >= 75 ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                          event.bookings >= 25 ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}>
                          {event.bookings} Bookings
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${event.bookings}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * index + 0.8 }}
                        className={`h-3.5 rounded-full ${
                          event.bookings >= 75 ? 'bg-green-600' : 
                          event.bookings >= 25 ? 'bg-blue-600' : 
                          'bg-yellow-600'
                        }`}
                      >
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bookings by Event */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Bookings by Event</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.bookingsByEvent}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue by Event */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue by Event</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.revenueByEvent}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bookings Over Time */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Bookings Over Time</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.bookingsByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ticket Type Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Ticket Type Distribution</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.ticketTypeDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label
                    >
                      {analytics.ticketTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventAnalytics; 
