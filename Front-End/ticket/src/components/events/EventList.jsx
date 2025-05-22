import React, { useState, useEffect, useCallback } from 'react';
import EventCard from './EventCard';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    location: '',
    priceRange: 'all'
  });

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/events', {
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if user is logged in
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // The response includes data in response.data.data
      const eventData = response.data.data || [];
      
      // Filter only approved events
      const approvedEvents = eventData.filter(event => event.status === 'approved');
      setEvents(approvedEvents);
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
    
    let matchesPrice = true;
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      matchesPrice = event.price >= min && (max ? event.price <= max : true);
    }

    return matchesSearch && matchesDate && matchesLocation && matchesPrice;
  });

  const locations = [...new Set(events.map(event => event.location))];

  if (loading) return <div className="text-center py-4">Loading events...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search events..."
          className="w-full p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <input
            type="date"
            className="p-2 border rounded-lg"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          
          <select
            className="p-2 border rounded-lg"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          
          <select
            className="p-2 border rounded-lg"
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
          >
            <option value="all">All Prices</option>
            <option value="0-50">$0 - $50</option>
            <option value="51-100">$51 - $100</option>
            <option value="101-200">$101 - $200</option>
            <option value="201">$201+</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No events found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList; 