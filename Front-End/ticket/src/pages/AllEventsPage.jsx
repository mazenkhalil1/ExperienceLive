import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '../components/events/EventCard';
import axiosInstance from '../services/axiosConfig';
import { useSearchFilter } from '../context/SearchFilterContext';
import { useTheme } from '../context/ThemeContext';

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchTerm, filters, setFilters, resetFilters } = useSearchFilter();
  const { isDarkMode } = useTheme();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/events');
      if (!response.data) {
        throw new Error('No data received from server');
      }
      setEvents(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const eventDate = new Date(event.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    const matchesDateRange = (!fromDate || eventDate >= fromDate) && (!toDate || eventDate <= toDate);

    const matchesLocation = !filters.location || event.location === filters.location;
    const matchesCategory = filters.category === 'all' || event.category === filters.category;
    
    let matchesPrice = true;
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      matchesPrice = event.price >= min && (max ? event.price <= max : true);
    }

    return matchesSearch && matchesDateRange && matchesLocation && matchesPrice && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg shadow-lg">
          {error}
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
      {/* Filters */}
      <div className="mb-8 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
        <span className="font-medium text-gray-700 dark:text-gray-300 mb-4 block">Filter Events:</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <label htmlFor="fromDate" className="mr-2 text-gray-600 dark:text-gray-400">From:</label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={filters.fromDate || ''}
              onChange={handleFilterChange}
              className="px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="toDate" className="mr-2 text-gray-600 dark:text-gray-400">To:</label>
             <input
              type="date"
              id="toDate"
              name="toDate"
              value={filters.toDate || ''}
              onChange={handleFilterChange}
              className="px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {/* Add more filter inputs here (location, category, price) if needed based on original EventList filters */}
           <button 
            onClick={resetFilters}
            className="ml-auto px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">All Events</h1>

      {/* Events Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="col-span-full text-center py-8"
            >
              <div className="text-gray-500 dark:text-gray-400 text-lg">No events found matching your criteria</div>
              <motion.button
                onClick={resetFilters}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear all filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AllEventsPage; 