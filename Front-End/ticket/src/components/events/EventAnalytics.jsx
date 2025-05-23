import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { useUser } from '../../context/UserContext';

const EventAnalytics = () => {
  const navigate = useNavigate();
  const { user, userRole } = useUser();
  const [analytics, setAnalytics] = useState([]);
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
      
      const res = await axiosInstance.get('/users/events/analytics');
      
      if (!res.data) {
        throw new Error('No data received from server');
      }

      if (!Array.isArray(res.data)) {
        throw new Error('Invalid data format received from server');
      }

      // Transform data - remove % symbol and convert to number
      const eventData = res.data.map(event => ({
        name: event.title,
        bookingPercentage: parseFloat(event.percentBooked)
      }));

      setAnalytics(eventData);
      setError(null);
    } catch (error) {
      if (!user || !userRole) {
        navigate('/login');
        return;
      }
      
      setError(error.response?.data?.message || error.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [navigate, verifyAccess, user, userRole]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="ml-64 flex justify-center items-center h-[calc(100vh-64px)] mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="ml-64 flex justify-center items-center h-[calc(100vh-64px)] mt-16">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
        </div>
    );
  }

  if (!analytics.length) {
    return (
      <div className="ml-64 flex justify-center items-center h-[calc(100vh-64px)] mt-16">
        <div className="text-center text-gray-500 text-xl">
          No analytics data available. Create and sell some events to see analytics here.
        </div>
      </div>
    );
  }

  // Calculate average booking percentage
  const averageBookingPercentage = (
    analytics.reduce((sum, event) => sum + event.bookingPercentage, 0) / analytics.length
  ).toFixed(1);

  return (
    <div className="ml-64 bg-gray-50 min-h-[calc(100vh-64px)] pt-16 px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/organizer/events')}
          className="mb-6 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Event Analytics Dashboard</h1>
          </div>

          <div className="p-6">
            {/* Overall Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Overall Booking Rate</h3>
              <p className="text-3xl font-bold text-purple-600">{averageBookingPercentage}%</p>
              <p className="text-sm text-gray-500 mt-1">Average across all events</p>
            </div>

            {/* Per Event Analytics */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Event Booking Details</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {analytics.map((event, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-lg font-semibold text-gray-800">{event.name}</h4>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${event.bookingPercentage >= 75 ? 'bg-green-100 text-green-800' : 
                          event.bookingPercentage >= 25 ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                          {event.bookingPercentage}% Booked
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            event.bookingPercentage >= 75 ? 'bg-green-600' : 
                            event.bookingPercentage >= 25 ? 'bg-blue-600' : 
                            'bg-yellow-600'
                          }`}
                          style={{ width: `${event.bookingPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
        </div>
      </div>

            {/* Footer */}
            <div className="mt-4 text-center text-gray-500 text-sm">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics; 
