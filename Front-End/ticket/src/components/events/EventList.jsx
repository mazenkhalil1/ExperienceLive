import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import axiosInstance from '../../services/axiosConfig';
import { useSearchFilter } from '../../context/SearchFilterContext';
import { useTheme } from '../../context/ThemeContext';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchTerm, filters, resetFilters } = useSearchFilter();
  const { isDarkMode } = useTheme();
  const scrollContainerRef = useRef(null);

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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !filters.date || new Date(event.date).toLocaleDateString() === filters.date;
    const matchesLocation = !filters.location || event.location === filters.location;
    const matchesCategory = filters.category === 'all' || event.category === filters.category;
    
    let matchesPrice = true;
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      matchesPrice = event.price >= min && (max ? event.price <= max : true);
    }

    return matchesSearch && matchesDate && matchesLocation && matchesPrice && matchesCategory;
  });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Categories data
  const categories = [
    { name: 'Comedy', emoji: '🎭', count: 5 },
    { name: 'Concerts', emoji: '🎵', count: 8 },
    { name: 'Sports', emoji: '⚽', count: 3 },
    { name: 'Theater', emoji: '🎭', count: 4 },
    { name: 'Food', emoji: '🍽️', count: 6 },
  ];

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
      {/* Upcoming Events Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Upcoming Events</h1>
        
        {/* Events Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Events Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredEvents.map(event => (
              <div key={event._id} className="flex-none w-[300px] snap-center">
                <EventCard event={event} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Show All Events Button */}
        <div className="flex justify-center mt-8">
          <Link
            to="/all-events"
            className="px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 font-medium"
          >
            Show All Events
          </Link>
        </div>
      </section>

      {/* Explore Top Categories Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Explore Top Categories</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center p-4 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
            >
              <span className="text-2xl mb-2">{category.emoji}</span>
              <span className="font-medium text-gray-800 dark:text-white">{category.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{category.count} Events</span>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default EventList; 