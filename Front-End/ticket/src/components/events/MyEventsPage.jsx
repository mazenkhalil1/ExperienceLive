import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const MyEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'date'
  });

  const fetchMyEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users/events');
      if (response.data && Array.isArray(response.data)) {
        setEvents(response.data || []);
      } else {
        setEvents(response.data?.data || []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch your events');
      showToast.error(err.response?.data?.message || 'Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/events/${eventId}`);
      showToast.success('Event deleted successfully');
      setEvents(events.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  // Filtered and sorted events (basic client-side filtering/sorting for demonstration)
  const filteredEvents = events.filter(event => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = !searchLower || event.title.toLowerCase().includes(searchLower) || event.location.toLowerCase().includes(searchLower);
    const matchesStatus = filters.status === 'all' || event.status === filters.status;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (filters.sortBy === 'date') {
      return new Date(a.date) - new Date(b.date);
    } else if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (filters.sortBy === 'price') {
      return a.price - b.price;
    }
    return 0; // Default sort
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen-except-nav-footer flex items-center justify-center">
        <Loader type="spinner" size="large" text="Loading events..." />
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 min-h-screen-except-nav-footer"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Events</h1>
      
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
         <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by title or location..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
         </div>

         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <select
              className="block w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>

             <select
              className="block w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
            </select>

         </div>

         <div className="flex space-x-4 w-full md:w-auto">
          <button
            onClick={() => {
              console.log('Navigating to analytics...');
              navigate('/organizer/analytics');
            }}
            className="w-1/2 md:w-auto bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
          >
            Analytics
          </button>
          <button
            onClick={() => navigate('/organizer/events/new')}
            className="w-1/2 md:w-auto bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
          >
            Create Event
          </button>
         </div>
      </div>

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          No events found matching your criteria. Create your first event!
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
           <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="overflow-x-auto"
            >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tickets</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {filteredEvents.map((event) => (
                  <motion.tr 
                    key={event._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">${event.price?.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{event.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase shadow-sm 
                        ${event.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                          event.status === 'declined' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {event.remainingTickets} / {event.totalTickets} available
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => navigate(`/organizer/events/edit/${event._id}`)}
                        className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 dark:text-red-400 hover:underline transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
           </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MyEventsPage; 